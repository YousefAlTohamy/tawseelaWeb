 // Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAbCy4DtMr7tyy-eLxX2ns57DwQknuB7Aw",
  authDomain: "dead-bot-app.firebaseapp.com",
  databaseURL: "https://dead-bot-app-default-rtdb.firebaseio.com",
  projectId: "dead-bot-app",
  storageBucket: "dead-bot-app.appspot.com",
  messagingSenderId: "237711896721",
  appId: "1:237711896721:web:3dc7aae380405f4f398f30",
  measurementId: "G-J98YKN03F8"
};

// Initialize Firebase
const firebaseApp = firebase.initializeApp(firebaseConfig);
const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storageref = firebaseApp.storage().ref();

// Initialize Collections
const driversCollection = db.collection('drivers');
const ridesCollection = db.collection('rides');


//==============================================السائقين=================================================//
// Display drivers 
function createdriverCard(driverObject) {
  return `
  <tr>
      <td>${driverObject.name}</td>
      <td>${driverObject.phone}</td>
      <td>${driverObject.email}</td>
      <td>${driverObject.password}</td>
      <td>${driverObject.car}</td> 
      <td>${driverObject.img}</td>
      <td>${driverObject.rating}</td>
      <td>
          <button onclick="modifyDrivers('${driverObject.id}')" >تعديل</button>  
          <button onclick="deleteDrivers('${driverObject.id}')" class="btn-danger">حذف</button>
      </td>
  </tr>
  `
}

// Get all drivers from Firebase 
let countdrivers;
async function getDrivers() {
  let Drivers = []
  await driversCollection.get().then(async snapshot => {
    countdrivers = snapshot.docs.length;
    document.getElementById('CountDrivers').innerHTML = countdrivers + ' سائق مسجل';
    for (let i = 0; i < snapshot.docs.length; i++) {
      const doc = snapshot.docs[i];
      const data = await doc.data();
      const docdata = {
        id: doc.id,
        ...data,
      }
      Drivers.push(docdata);
    }
  })
  return Drivers;
}

// Add driver to Firebase
async function addDrivers(){
  const name = document.getElementById('nameInp').value;
  const phone = document.getElementById('phoneInp').value;
  const email = document.getElementById('emailInp').value;
  const password = document.getElementById('passInp').value;
  const car = document.getElementById('CarInp').value;
  const img = document.getElementById('imgInp').value;
  const rating = document.getElementById('rateInp').value;
  await driversCollection.add({
    name,
    phone,
    email,
    password,
    img,
    car,
    rating,
  })
  await refreshDrivers();
  add_driver_popup();
}
// Delete driver from Firebase 
async function deleteDrivers(driverId) {
  await driversCollection.doc(driverId).delete();
  await refreshDrivers();
  delete_driver_popup();
}

// Modify driver in Firebase
async function modifyDrivers(driverId) {
  await driversCollection.doc(driverId).update({
    // waiting for the page to edit info
  })
  await refreshDrivers();
  modify_driver_popup();
}

// Refresh after any change on the Firebase 
async function refreshDrivers() {
  // my logic
  const drivers = await getDrivers();
  const driversContainer = document.getElementById('drivers-container');
  driversContainer.innerHTML = 'No Drivers Yet.'
  if (drivers.length > 0) {
    driversContainer.innerHTML = drivers.map(createdriverCard).join('')
  }
}

(async () => {
  await refreshDrivers();
})()


// Display pop_up message after add driver
function add_driver_popup(){
    Swal.fire({
        title: 'تم!',
        text: 'تمت إضافة السائق بنجاح',
        icon: 'success',
        confirmButtonText: 'موافق'
    });
}

// Display pop_up message after modify driver
function modify_driver_popup(){
  Swal.fire({
      title: 'تم!',
      text: 'تمت تعديل بيانات السائق بنجاح',
      icon: 'success',
      confirmButtonText: 'موافق'
  });
}

// Display pop_up message after delete driver
function delete_driver_popup(){
  Swal.fire({
      title: 'تم!',
      text: 'تمت حذف السائق بنجاح',
      icon: 'success',
      confirmButtonText: 'موافق'
  });
}

//==============================================الرحلات=================================================//

function createRideCard(rideObject) {
  return `
  <tr>
      <td>${rideObject.from}</td>
      <td>${rideObject.to}</td>
      <td>${rideObject.endTime}</td>
      <td>${rideObject.price}</td>
      <td>${rideObject.uid}</td> 
  </tr>
  `
}

// Get all drivers from Firebase 
let countRides;
async function getRiders() {
  let Rides = []
  await ridesCollection.get().then(async snapshot => {
    countRides = snapshot.docs.length;
    document.getElementById('countRides').innerHTML = countRides + ' رحلة';
    for (let i = 0; i < snapshot.docs.length; i++) {
      const doc = snapshot.docs[i];
      const data = await doc.data();
      const docdata = {
        id: doc.id,
        ...data,
      }
      Rides.push(docdata);
    }
  })
  return Rides;
}

// Refresh after any change on the Firebase 
async function refreshRides() {
  // my logic
  const Rides = await getRiders();
  const ridesContainer = document.getElementById('rides-container');
  ridesContainer.innerHTML = 'No Rides Yet.'
  if (Rides.length > 0) {
    ridesContainer.innerHTML = Rides.map(createRideCard).join('')
  }
}

(async () => {
  await refreshRides();
})()