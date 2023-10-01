// import React, { useState } from "react";
// import Navbar from "../Common/Navbar";
// import OfflineNavbar from "../Common/OfflineNavbar";
// import NotesList from "../Home/components/NotesList";
// import { Note } from "@/types/Note";
// import { db } from "@/utils/indexdb/db";

// const Offline = () => {
//   const [notes, setNotes] = useState<Note[]>([]);

//   const addingNote = async () => {
//     try {
//       const newNote: Note{
//         noteTitle: "",
//         noteContent: JSON.stringify({
//           type: "doc",
//           content: [
//             {
//               type: "paragraph",
//             },
//           ],
//         }),
//       });

//     } catch (error) {
//       console.log(error);
//     }
//   };
//   return (
//     <>
//       <OfflineNavbar />
//       <NotesList
//         addingNote={false}
//         addNote={() => {}}
//         deleteNote={() => {}}
//         updateNote={() => {}}
//         notes={notes}
//       />
//     </>
//   );
// };

// export default Offline;
