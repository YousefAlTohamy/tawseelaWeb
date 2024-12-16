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
const couponsCollection = db.collection('copouns');



//========================================================================================================//
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
  const inputIds = ['nameInp', 'phoneInp', 'emailInp', 'passInp', 'CarInp', 'imgInp', 'rateInp'];
  // Clear input fields using a loop
  inputIds.forEach(id => {
    document.getElementById(id).value = '';
  });
}
// Delete driver from Firebase 
async function deleteDrivers(driverId) {
  await driversCollection.doc(driverId).delete();
  await refreshDrivers();
  delete_driver_popup();
}

// Modify driver in Firebase
// دالة لتعديل بيانات السائق في Firebase
async function modifyDrivers(driverId) {
  // جلب بيانات السائق الحالية من Firebase
  const doc = await driversCollection.doc(driverId).get();
  const driverData = doc.data();

  // ملء الحقول في النافذة المنبثقة بالقيم الحالية
  document.getElementById('nameInp2').value = driverData.name;
  document.getElementById('phoneInp2').value = driverData.phone;
  document.getElementById('emailInp2').value = driverData.email;
  document.getElementById('passInp2').value = driverData.password;
  document.getElementById('CarInp2').value = driverData.car;
  document.getElementById('imgInp2').value = driverData.img;
  document.getElementById('rateInp2').value = driverData.rating;

  // فتح نافذة التعديل المنبثقة
  document.getElementById('editDriverPopup').style.display = 'block';
  
  // إضافة حدث لحفظ التعديلات
  document.getElementById('saveChangesBtn').onclick = async function() {
    const updatedName = document.getElementById('nameInp2').value;
    const updatedPhone = document.getElementById('phoneInp2').value;
    const updatedEmail = document.getElementById('emailInp2').value;
    const updatedPassword = document.getElementById('passInp2').value;
    const updatedCar = document.getElementById('CarInp2').value;
    const updatedImg = document.getElementById('imgInp2').value;
    const updatedRating = document.getElementById('rateInp2').value;

    // تحديث بيانات السائق في Firebase
    await driversCollection.doc(driverId).update({
      name: updatedName,
      phone: updatedPhone,
      email: updatedEmail,
      password: updatedPassword,
      car: updatedCar,
      img: updatedImg,
      rating: updatedRating,
    });

    // تحديث قائمة السائقين
    await refreshDrivers();
    modify_driver_popup();

    // إغلاق نافذة التعديل
    closeEditPopup();
  };
}

// دالة لإغلاق نافذة التعديل
function closeEditPopup() {
  document.getElementById('editDriverPopup').style.display = 'none';
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
      text: 'تم تعديل بيانات السائق بنجاح',
      icon: 'success',
      confirmButtonText: 'موافق'
  });
}

// Display pop_up message after delete driver
function delete_driver_popup(){
  Swal.fire({
      title: 'تم!',
      text: 'تم حذف السائق بنجاح',
      icon: 'success',
      confirmButtonText: 'موافق'
  });
}


//======================================================================================================//
//==============================================الرحلات=================================================//

// Function to create a table row for each ride
function createRideCard(rideObject) {
  return `
    <tr>
        <td>${rideObject.from}</td>
        <td>${rideObject.to}</td>
        <td>${formatTimestamp(rideObject.endTime)}</td>
        <td>${rideObject.price}</td>
        <td>${rideObject.status}</td>
        <td>${rideObject.uid}</td> 
    </tr>
  `;
}

// Helper function to format Firestore timestamps
function formatTimestamp(timestamp) {
  if (!timestamp) return "N/A";
  const date = timestamp.toDate(); // Firestore Timestamp -> JS Date
  return date.toLocaleString("en-US", { 
    year: "numeric", 
    month: "short", 
    day: "numeric", 
    hour: "2-digit", 
    minute: "2-digit" 
  });
}

// Get all rides from Firebase
async function getRiders() {
  const Rides = [];
  try {
    const snapshot = await ridesCollection.get();

    // Count total rides
    const countRides = snapshot.size;
    document.getElementById("countRides").innerHTML = `${countRides} رحلة`;

    // Extract and push ride data
    snapshot.forEach(doc => {
      Rides.push({
        id: doc.id,
        ...doc.data()
      });
    });
  } catch (error) {
    console.error("Error fetching rides:", error);
  }
  return Rides;
}


// Render rides to the table
async function renderRides() {
  const rides = await getRiders();
  const tableBody = document.getElementById("ridesTableBody");
  tableBody.innerHTML = ""; // Clear table

  rides.forEach(ride => {
    tableBody.innerHTML += createRideCard(ride);
  });
}

// Call the function to fetch and render rides
renderRides();


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


//===========================================================================================================//
//==============================================قسائم الخصم=================================================//


function createCouponCard(couponObject) {
  return `
    <tr>
        <td>${couponObject.Name}</td>
        <td>${couponObject.Code}</td>
        <td>${couponObject.Percentage}%</td>
        <td>${couponObject.EndDate}</td>
        <td>${couponObject.DiscountValue}</td>
        <td> 
            <button onclick="deleteCoupon('${couponObject.id}')" class="btn-danger">حذف</button>
        </td>
    </tr>
  `;
}


async function getCoupons() {
  const Coupons = [];
  await couponsCollection.get().then(async snapshot => {
    for (let i = 0; i < snapshot.docs.length; i++) {
      const doc = snapshot.docs[i];
      const data = await doc.data();
      const docdata = {
        id: doc.id,
        ...data,
      }
      Coupons.push(docdata);
    }
  })
  return Coupons;
}

async function refreshCoupons() {
  const coupons = await getCoupons();
  const couponsContainer = document.getElementById("coupons-container");
  couponsContainer.innerHTML = "No Coupons Yet.";

  if (coupons.length > 0) {
    couponsContainer.innerHTML = coupons.map(createCouponCard).join("");
  }
}

// Call the function to fetch and render coupons
(async () => {
  await refreshCoupons();
})();

async function addCoupon(){
  const coupName = document.getElementById('nCInp').value;
  const code = document.getElementById('codeInp').value;
  const percentage = document.getElementById('perInp').value;
  const endTime = document.getElementById('endInp').value;
  const disValue = document.getElementById('valInp').value;

  await couponsCollection.add({
    Code: code,
    Name: coupName,
    Percentage: percentage,
    EndDate: endTime,
    DiscountValue: disValue
  })
  await refreshCoupons();
  add_coupon();
  const inputIds = ['nCInp', 'codeInp', 'perInp', 'endInp', 'valInp'];
  inputIds.forEach(id => {
    document.getElementById(id).value = '';
  });
}


// Delete coupon from Firebase
async function deleteCoupon(couponId) {
    await couponsCollection.doc(couponId).delete();
    await refreshCoupons();
    delete_coupon();
}

// Display pop_up message after delete coupon
function delete_coupon(){
  Swal.fire({
    title: 'تم!',
    text: 'تم حذف القسيمة بنجاح',
    icon: 'success',
    confirmButtonText: 'موافق'
});
}

// Display pop_up message after add coupon
function add_coupon(){
  Swal.fire({
    title: 'تم!',
    text: 'تم اضاقة القسيمة بنجاح',
    icon: 'success',
    confirmButtonText: 'موافق'
});
}
