<template>
  <section>
    <div class="alert h6 text-right" @click="doLogin">
      [login:{{ data.user != null ? data.user.displayName : "---" }}]
    </div>
    <h2>{{ data.title }}</h2>
    <p class="h5">{{ data.message }}</p>
    <div v-if="data.user" class="alert alert-primary">
      <div class="form-group text-left">
        <label class="h5">Message</label>
        <div class="form-row">
          <div class="col-10">
            <input v-model="data.msg" class="form-control">
          </div>
          <button @click="add" class="btn btn-primary col-2">投稿</button>
        </div>
      </div>
      <h3 class="my-3">Messages</h3>
      <ul v-for="(item, key) in data.fire_data" class="list-group text-left">
        <li class="list-group-item">
          <div class="h5">{{ item.msg }}</div>
          <div class="small text-right">{{ item.user }} ({{ item.posted }})</div>
        </li>
      </ul>
    </div>
    <div v-else>
      <div class="alert alert-warning">
        ※現在、ログインされていません。
      </div>
    </div>
  </section>    
</template>

<script>
import { reactive, onMounted } from "vue"
import { getAuth, signInWithPopup, GoogleAuthProvider } from "firebase/auth"
import { getDatabase, ref, set, onValue, query, orderByKey, limitToLast } from "firebase/database"

const provider = new GoogleAuthProvider()

export default {
  setup(props) {
    const auth = getAuth()
    const db = getDatabase()
    const data = reactive({
      title: "Board",
      message: "ミニ伝言板。最新の投稿を表示します。",
      user: null,
      msg: "",
      num_per_page: 10, // 取り出すデータ数
      fire_data: {},
    })
    // ログイン処理
    const login = ()=> {
      signInWithPopup(auth, provider).then((result)=> {
        data.user = result.user
        data.message = "ログインしました。"

        // データ取得
        onValue(query(ref(db, "board"), orderByKey(), limitToLast(data.num_per_page)), (snapshot)=> {
          if(auth.currentUser != null) {
            let arr = []
            let result = snapshot.val()
            for(let item in result) {
              arr.unshift(result[item])
            }
            console.log(arr)
            data.fire_data = arr
          } else {
            data.fire_data = {}
          }
        })
      })
    }
    // ログアウト処理
    const logout = ()=> {
      auth.signOut()
      data.user = null
      data.fire_data = {}
      data.message = "ログアウトしました。"
    }
    // ログイン・ログアウト実行
    const doLogin = ()=> {
      if(auto.currentUser == null) {
        login()
      } else {
        logout()
      }
    }
    // メッセージ追加
    const add = ()=> {
      if(auth.currentUser == null) {
        alert("ログインしないと投稿できません。")
        return
      }
      let user = auth.currentUser
      console.log(user)
      let d = new Date()
      let dstr = d.getFullYear() + "-" + (d.getMonth() + 1) + "-" + d.getDate() + " " + d.getHours() + ":" + d.getMinutes() + ":" + d.getSeconds()
      let id = d.getTime()
      let obj = {
        msg: data.msg,
        user: user.displayName,
        posted: dstr,
      }
      // データ書き込み
      set(ref(db, "board/" + id), obj)
      data.msg = ""
      data.message = "投稿しました。"
    }
    onMounted(()=> {
      if(auth.currentUser == null) {
        login()
      }
      console.log(auth.currentUser)
    })
    return { data, login, logout, doLogin, add }
  },
}
</script>
