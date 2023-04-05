import { openDB } from "idb";
import { useEffect } from "react";
import { useRef } from "react";

const useIndexedDB = () => {
  const db = useRef(null);
  useEffect(() => {
    const createDB = async () => {
      db.current = await openDB("Notes", 1, {
        upgrade(db) {
          // Create a store of objects
          const store = db.createObjectStore("notes", {
            // The 'id' property of the object will be the key.
            keyPath: "id",
            // If it isn't explicitly set, create a value by auto incrementing.
            autoIncrement: true,
          });
          // Create an index on the 'date' property of the objects.
          store.createIndex("date", "date");
        },
      });
      console.log("created db");
    };
    createDB();
  }, []);

  return db.current;
};

export default useIndexedDB;
