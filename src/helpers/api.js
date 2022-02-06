import {
  collection,
  query,
  where,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  orderBy,
  limit,
} from "firebase/firestore";

import { db, storage } from "./firebase";
import dayjs from "dayjs";
import { getDownloadURL, ref, uploadBytes } from "firebase/storage";

export const fetch = async (uid = "", filterMonth = null) => {
  let q;
  if (filterMonth) {
    // filterMonth 2022-02 ⇨ for firebase 2022/02
    filterMonth = filterMonth.replace("-", "/");
    q = query(
      collection(db, "diaries"),
      where("uid", "==", uid),
      where("createdAt", ">=", filterMonth + "/01"),
      where("createdAt", "<=", filterMonth + "/31"),
      limit(31)
    );
  } else {
    q = query(
      collection(db, "diaries"),
      where("uid", "==", uid),
      orderBy("createdAt", "desc"),
      limit(31)
    );
  }

  const querySnapshot = await getDocs(q);
  let diaries = [];
  querySnapshot.forEach((doc) => {
    // doc.data() is never undefined for query doc snapshots
    console.log(doc.id, " => ", doc.data());
    diaries.push({
      id: doc.id,
      body: doc.data().body,
      rate: doc.data().rate,
      image: doc.data().image,
      createdAt: doc.data().createdAt,
    });
  });
  return diaries;
};

// Add a new document with a generated id
export const postDiary = async (
  uid = "",
  body = "",
  rate = 1,
  image = null
) => {
  let uploadResult = "";
  if (image) {
    const storageRef = ref(storage);
    // 拡張子を取得
    const ext = image.name.split(".").pop();
    // 画像ファイル名を固定しておく
    const hasName = Math.random().toString(36).slice(-8);
    const uploadRef = ref(storageRef, `/images/${hasName}.${ext}`);
    console.log("寸前");
    await uploadBytes(uploadRef, image).then(async function (result) {
      console.log(result);
      console.log("Uploaded a blob or file!");

      // ここでダウンロード(表示)用URL作成
      // firebaseから画像を表示するにはダウンロード用URLの取得が必要。
      await getDownloadURL(updateRef).then(function (url) {
        uploadResult = url;
      });
    });
  }

  // collection(A, B)  A: firestoreのコレクション（firestoreを初期化したものを入れる）, B: firestoreで設定したドキュメント名
  const docRef = await addDoc(collection(db, "diaries"), {
    uid: uid,
    rate: rate,
    body: body,
    image: uploadResult,
    createdAt: dayjs().format("YYYY/MM/DD HH:mm:ss"),
  });
  console.log("Document written with ID: ", docRef.id);
  // 成功したらドキュメントにIDが割り振られる
  // もし成功したらtrue, 失敗したらfalseを返す。
  return docRef.id ? true : false;
};

export const getDiary = async (id = "dummy") => {
  const docRef = doc(db, "diaries", id);
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    console.log("Document data:", docSnap.data());
    return docSnap.data();
  } else {
    // doc.data() will be undefined in this case
    console.log("No such document!");
    return false;
  }
};

export const updateDairy = async (id = "", body = "", rate = 1, image = "") => {
  let uploadResult = "";
  if (image) {
    const storageRef = ref(storage);
    // 拡張子を取得
    const ext = image.name.split(".").pop();
    // 画像ファイル名を固定しておく
    const hasName = Math.random().toString(36).slice(-8);
    const uploadRef = ref(storageRef, `/images/${hasName}.${ext}`);
    console.log("寸前");
    await uploadBytes(uploadRef, image).then(async function (result) {
      console.log(result);
      console.log("Uploaded a blob or file!");

      // ここでダウンロード(表示)用URL作成
      // firebaseから画像を表示するにはダウンロード用URLの取得が必要。
      await getDownloadURL(updateRef).then(function (url) {
        uploadResult = url;
      });
    });
  }

  const dairyRef = doc(db, "diaries", id);

  if (!dairyRef) return false;

  let updateData;
  if (image.name) {
    updateData = {
      body: body,
      rate: rate,
      image: updateResult,
    };
  } else {
    updateData = {
      body: body,
      rate: rate,
    };
  }

  await updateDoc(dairyRef, updateData);
  return true;
};

export const deleteDiary = async (id) => {
  if (!id) {
    return false;
  }
  await deleteDoc(doc(db, "diaries", id));
  return true;
};
