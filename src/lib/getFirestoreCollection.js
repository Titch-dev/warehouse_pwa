import { collection, getDocs, query, where, orderBy } from "firebase/firestore";
import { warehouseDB } from "@/firebase/firebaseConfig";

export async function getFirestoreCollection(collectionName, options = {}) {
    try {
        if (!collectionName) throw new Error("Collection name required");

        // Construct Firestore query
        const collectionRef = collection(warehouseDB, collectionName);
        let q = collectionRef;

        if (options.where) q = query(q, where(...options.where));
        if (options.orderBy) q = query(q, orderBy(...options.orderBy));

        // Fetch snapshot
        const snapshot = await getDocs(q);

        // Map docs with IDs included
        const docs = snapshot.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
        }))

        return docs;
    } catch (error) {
        console.error("Error fetching Firestore collection:", error);
        throw new Error(error.message || "Failed to fetch Firestore data.");
    }
}