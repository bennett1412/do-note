import React, {
  useRef,
  useEffect,
  useState,
  isValidElement,
  cloneElement,
} from "react";
import {
  useFloating,
  offset,
  flip,
  shift,
  useListNavigation,
  useHover,
  useTypeahead,
  useInteractions,
  useRole,
  useClick,
  useDismiss,
  autoUpdate,
  safePolygon,
  FloatingPortal,
  useFloatingTree,
  useFloatingNodeId,
  useFloatingParentNodeId,
  useMergeRefs,
  FloatingNode,
  FloatingTree,
  FloatingFocusManager,
} from "@floating-ui/react";

export const MenuItem = ({ label, disabled, ...props }, ref) => {
  return (
    <button {...props} ref={ref} role="menuitem" disabled={disabled}>
      {label}
    </button>
  );
};

export const MenuComponent = ({ children, label, ...props }, forwardedRef) => {
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState();
  const [allowHover, setAllowHover] = useState(false);

  const listItemsRef = useRef([]);
  //   const listContentRef = useRef(
  //     Children.map(children, (child) =>
  //       isValidElement(child) ? child.props.label : null
  //     ) as Array<string | null>
  //   );
  const listContentRef = useRef(
    children.map((child) => {
      isValidElement(child) ? child.props.label : null;
    })
  );
  const tree = useFloatingTree();
  const nodeId = useFloatingNodeId();
  const parentId = useFloatingParentNodeId();
  const nested = parentId != null;

  const { x, y, strategy, refs, context } = useFloating({
    open,
    nodeId,
    onOpenChange: setOpen,
    placement: nested ? "right-start" : "bottom-start",
    middleware: [
      offset({ mainAxis: 5, alignmentAxis: nested ? -4 : 0 }),
      flip(),
      shift(),
    ],
    whileElementsMounted: autoUpdate,
  });

  const { getReferenceProps, getFloatingProps, getItemProps } = useInteractions(
    [
      useHover(context, {
        handleClose: safePolygon({
          restMs: 25,
          blockPointerEvents: true,
        }),
        enabled: nested && allowHover,
        delay: { open: 75 },
      }),
      useClick(context, {
        toggle: !nested || !allowHover,
        event: "mousedown",
        ignoreMouse: nested,
      }),
      useRole(context, { role: "menu" }),
      useDismiss(context),
      useListNavigation(context, {
        listRef: listItemsRef,
        activeIndex,
        nested,
        onNavigate: setActiveIndex,
      }),
      useTypeahead(context, {
        listRef: listContentRef,
        onMatch: open ? setActiveIndex : undefined,
        activeIndex,
      }),
    ]
  );

  // Event emitter allows you to communicate across tree components.
  // This effect closes all menus when an item gets clicked anywhere
  // in the tree.
  useEffect(() => {
    function handleTreeClick() {
      setOpen(false);
    }

    function onSubMenuOpen(event) {
      if (event.nodeId !== nodeId && event.parentId === parentId) {
        setOpen(false);
      }
    }

    tree?.events.on("click", handleTreeClick);
    tree?.events.on("menuopen", onSubMenuOpen);

    return () => {
      tree?.events.off("click", handleTreeClick);
      tree?.events.off("menuopen", onSubMenuOpen);
    };
  }, [tree, nodeId, parentId]);

  useEffect(() => {
    if (open) {
      tree?.events.emit("menuopen", {
        parentId,
        nodeId,
      });
    }
  }, [tree, open, nodeId, parentId]);

  // Determine if "hover" logic can run based on the modality of input. This
  // prevents unwanted focus synchronization as menus open and close with
  // keyboard navigation and the cursor is resting on the menu.
  useEffect(() => {
    function onPointerMove({ pointerType }) {
      if (pointerType !== "touch") {
        setAllowHover(true);
      }
    }

    function onKeyDown() {
      setAllowHover(false);
    }

    window.addEventListener("pointermove", onPointerMove, {
      once: true,
      capture: true,
    });
    window.addEventListener("keydown", onKeyDown, true);
    return () => {
      window.removeEventListener("pointermove", onPointerMove, {
        capture: true,
      });
      window.removeEventListener("keydown", onKeyDown, true);
    };
  }, [allowHover]);

  const referenceRef = useMergeRefs([refs.setReference, forwardedRef]);

  return (
    <FloatingNode id={nodeId}>
      <button
        ref={referenceRef}
        data-open={open ? "" : undefined}
        {...getReferenceProps({
          ...props,
          className: `${nested ? "MenuItem" : "RootMenu"}`,
          onClick(event) {
            event.stopPropagation();
          },
          ...(nested && {
            // Indicates this is a nested <Menu /> acting as a <MenuItem />.
            role: "menuitem",
          }),
        })}
      >
        {label}{" "}
        {nested && (
          <span aria-hidden style={{ marginLeft: 10 }}>
            ➔
          </span>
        )}
      </button>
      <FloatingPortal>
        {open && (
          <FloatingFocusManager
            context={context}
            // Prevent outside content interference.
            modal={!nested}
            // Only initially focus the root floating menu.
            initialFocus={nested ? -1 : 0}
            // Only return focus to the root menu's reference when menus close.
            returnFocus={!nested}
            // Allow touch screen readers to escape the modal root menu
            // without selecting anything.
            visuallyHiddenDismiss
          >
            <div
              ref={refs.setFloating}
              className="Menu"
              style={{
                position: strategy,
                top: y ?? 0,
                left: x ?? 0,
                width: "max-content",
              }}
              {...getFloatingProps({
                // Pressing tab dismisses the menu due to the modal
                // focus management on the root menu.
                onKeyDown(event) {
                  if (event.key === "Tab") {
                    setOpen(false);

                    if (event.shiftKey) {
                      event.preventDefault();
                    }
                  }
                },
              })}
            >
              {children.map(
                (child, index) =>
                  isValidElement(child) &&
                  cloneElement(
                    child,
                    getItemProps({
                      tabIndex: activeIndex === index ? 0 : -1,
                      role: "menuitem",
                      className: "MenuItem",
                      ref(node) {
                        listItemsRef.current[index] = node;
                      },
                      onClick(event) {
                        child.props.onClick?.(event);
                        tree?.events.emit("click");
                      },
                      // Allow focus synchronization if the cursor did not move.
                      onMouseEnter() {
                        if (allowHover && open) {
                          setActiveIndex(index);
                        }
                      },
                    })
                  )
              )}
            </div>
          </FloatingFocusManager>
        )}
      </FloatingPortal>
    </FloatingNode>
  );
};

export const Menu = (props, ref) => {
  const parentId = useFloatingParentNodeId();

  if (parentId == null) {
    return (
      <FloatingTree>
        <MenuComponent {...props} ref={ref} />
      </FloatingTree>
    );
  }

  return <MenuComponent {...props} ref={ref} />;
};
