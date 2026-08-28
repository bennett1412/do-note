import { PaletteIcon } from "@/utils/icons";
import { ActionIcon, ColorSwatch, Menu, SimpleGrid } from "@mantine/core";

type ColorMenuProps = {
  setColor: (color: string) => void;
};

const paletteColors = [
  "var(--note-bg-light-1)",
  "var(--note-bg-light-2)",
  "var(--note-bg-dark-1)",
  "var(--note-bg-dark-2)",
  "var(--note-bg-dark-3)",
  "var(--note-bg-dark-4)",
];

const ColorMenu = ({ setColor }: ColorMenuProps) => {
  return (
    <Menu position="bottom" offset={8} shadow="md" width={130}>
      <Menu.Target>
        <ActionIcon title="change note color" variant="subtle" color="gray" radius="xl" size="lg">
          <PaletteIcon size={20} />
        </ActionIcon>
      </Menu.Target>
      <Menu.Dropdown bg="surface.3" p="xs">
        <SimpleGrid cols={3} spacing="xs">
          {paletteColors.map((color) => (
            <ColorSwatch
              key={color}
              component="button"
              type="button"
              color={color}
              size={28}
              withShadow
              onClick={() => setColor(color)}
              style={{ cursor: "pointer" }}
            />
          ))}
        </SimpleGrid>
      </Menu.Dropdown>
    </Menu>
  );
};

export default ColorMenu;