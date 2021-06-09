<template>
    <div>
        <div class="jumbotron bg-primary text-white text-center">
            <h2 class="lead display-4">#Slack with VueJs#</h2>
            <p>Realtime communication at it's best</p>
        </div>
        <div class="alert alert-info" role="alert" v-if="loading">
            <strong>Processing....</strong>
        </div>
        <div class="alert alert-danger" role="alert" v-if="hasErrors">
            <strong v-for="error in errors" :key="error">{{ error }}</strong>
        </div>
        <div class="container-fluid">
            <div class="row mt-5">
                <div class="col text-center">
                    <button
                        class="btn btn-outline-danger btn-lg mx-2"
                        @click="loginwithGoogle"
                    >
                        Login with Google
                    </button>
                    <button
                        class="btn btn-outline-info btn-lg mx-2"
                        @click="loginwithGithub"
                    >
                        Login with GitHub
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import auth from "firebase/auth";
import database from "firebase/database";
export default {
    name: "login",
    data() {
        return {
            errors: [],
            loading: false,
            usersRef: firebase.database().ref("users"),
        };
    },
    computed: {
        hasErrors() {
            return this.errors.length > 0;
        },
    },
    methods: {
        loginwithGoogle() {
            this.loading = true;
            this.errors = [];
            firebase
                .auth()
                .signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then((res) => {
                    this.saveUserToUsersRef(res.user);
                    this.$store.dispatch("setUser", res.user);
                })
                .then(() => this.$router.push("/"))
                .catch((err) => {
                    this.errors.push(err.message);
                    this.loading = false;
                });
        },
        loginwithGithub() {
            this.loading = true;
            this.errors = [];
            firebase
                .auth()
                .signInWithPopup(new firebase.auth.GithubAuthProvider())
                .then((res) => {
                    this.saveUserToUsersRef(res.user);
                    this.$store.dispatch("setUser", res.user);
                })
                .then(() => this.$router.push("/"))
                .catch((err) => {
                    this.errors.push(err.message);
                    this.loading = false;
                });
        },
        saveUserToUsersRef(user) {
            return this.usersRef.child(user.uid).set({
                name: user.displayName,
                avatar: user.photoURL,
            });
        },
    },
};
</script>
