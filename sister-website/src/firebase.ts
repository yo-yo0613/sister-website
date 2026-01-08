// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCP3lzOguwXMYagKrDpV8j2UTPcVyEOMlI",
  authDomain: "sister-website-721f5.firebaseapp.com",
  projectId: "sister-website-721f5",
  storageBucket: "sister-website-721f5.firebasestorage.app",
  messagingSenderId: "436452092942",
  appId: "1:436452092942:web:bcb026fde4c5ca2019e05f"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// 匯出常用的服務
export const db = getFirestore(app);      // 資料庫：存文章內容
export const storage = getStorage(app);  // 儲存空間：存圖片
export const auth = getAuth(app);        // 驗證：後台登入用

export default app;