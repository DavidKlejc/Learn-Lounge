import { atom } from "jotai";
import { IEditableFlashcard } from "../interfaces/IEditableFlashcard";

const flashcardsAtom = atom<IEditableFlashcard[]>([]);

export { flashcardsAtom };
