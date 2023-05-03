import { ref } from "firebase/storage";
import { storage } from "./init";
// Get a reference to the storage service, which is used to create references in your storage bucket

// Create a storage reference from our storage service
const storageRef = ref(storage);
