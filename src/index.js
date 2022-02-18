import '../index.css';
import { initializeApp } from 'firebase/app';
import { 
    getFirestore, collection, onSnapshot,
    addDoc, deleteDoc, doc, 
    query, where,
    orderBy, serverTimestamp, 
    getDoc, updateDoc, 
} from 'firebase/firestore';

import { 
    getAuth, 
    createUserWithEmailAndPassword, 
    signOut, signInWithEmailAndPassword, 
    onAuthStateChanged
} from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyDUjIYwDJwVl1HDPteTQ0YXuqfrO_bBNnw",
    authDomain: "fir-net-ninja-c6417.firebaseapp.com",
    projectId: "fir-net-ninja-c6417",
    storageBucket: "fir-net-ninja-c6417.appspot.com",
    messagingSenderId: "828945828169",
    appId: "1:828945828169:web:e71e94b2407244fa037298"
};

// init firebase app
initializeApp(firebaseConfig);

// init services
const db = getFirestore();
// initialize authentication service
const auth = getAuth();

// collection ref
const collectionRef = collection(db, 'items');

// queries
const q = query(collectionRef, orderBy('title', 'asc'));
// FULL SYNTAX
// const q = query(collectionRef, where('category', '==', 'clothing'), orderBy('title', 'asc'));

// real time collection data

onSnapshot(q, (snapshot) => {
    let items = [];
        snapshot.docs.forEach((doc) => {
            // for each object adding a new object to the items array
            items.push({...doc.data(), id: doc.id });
        });
        console.log(items);
});

// adding docs
const addItemForm = document.querySelector('.add')
addItemForm.addEventListener('submit', (event) => {
    event.preventDefault()
    // object represents new object want to add to collection
    addDoc(collectionRef, {
        title: addItemForm.title.value, 
        img: addItemForm.img.value, 
        description: addItemForm.description.value,
        category: addItemForm.category.value,
        votes: addItemForm.votes.value,
        owner: addItemForm.owner.value,
        open_to_offers: addItemForm.open_to_offers.value,
        swap_for_category: addItemForm.swap_for_category.value,
        createdAt: serverTimestamp()
    })
    .then(() => {
        addItemForm.reset();
    })
});

// deleting docs
const deleteItemForm = document.querySelector('.delete')
deleteItemForm.addEventListener('submit', (event) => {
    event.preventDefault()
    
    const docRef = doc(db, 'items', deleteItemForm.id.value)
    deleteDoc(docRef)
        .then(() => {
            deleteItemForm.reset()
        })
});

// get a single document
const docRef = doc(db, 'items', 'F0Nhx1IxF4EgHuG60IUI')

// getDoc(docRef)
//     .then((doc) => {
//         console.log(doc.data(), doc.id)
//     });

//subscribing to changes on a specifc document
onSnapshot(docRef, (doc) => {
    console.log(doc.data(), doc.id)
});

// updating a document
const updateItemForm = document.querySelector('.update')
updateItemForm.addEventListener('submit', (e) => {
    e.preventDefault()

    const docRef = doc(db, 'items', updateItemForm.id.value)

    updateDoc(docRef, {
        title: 'Converse trainers'
    })
    .then(() => {
        updateItemForm.reset();
    })
});

// signing users up
const signupForm = document.querySelector('.signup')
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const email = signupForm.email.value;
    const password = signupForm.password.value;
    // const username = signupForm.username.value;
    createUserWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            // console.log('user created:', cred.user);
            signupForm.reset()
        })
        .catch((err) => {
            console.log(err.message)
        });
})

// loginng in and out
const logoutButton = document.querySelector('.logout')
logoutButton.addEventListener('click', (e) => {
    signOut(auth)
        .then(() => {
            // console.log('the user signed out')
        })
        .catch((err) => {
            console.log(err.message)
        });
});

const loginForm = document.querySelector('.login')
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = loginForm.email.value;
    const password = loginForm.password.value;
    signInWithEmailAndPassword(auth, email, password)
        .then((cred) => {
            // console.log('user logged in: ', cred.user);
            loginForm.reset();
        })
        .catch((err) => {
            console.log(err.message);
        });
})

//subscribing to auth changes

onAuthStateChanged(auth, (user) => {
    console.log('user status changed: ', user);
});