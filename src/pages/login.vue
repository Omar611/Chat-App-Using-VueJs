<template>
    <div>
        <div
            class="
                login-page
                d-flex
                justify-content-center
                align-items-center
                p-3
            "
        >
            <div class="login-container bg-dark">
                <div class="row">
                    <div class="login-left col-lg-6"></div>
                    <div class="login-right p-4 col-lg-6 text-center">
                        <div class="row">
                            <div class="col text-center">
                                <div class="text-white text-center">
                                    <h2 class="lead display-4">
                                        #Slack with VueJs#
                                    </h2>
                                    <h4 class="mt-5">
                                        Realtime communication at it's best
                                    </h4>
                                    <div
                                        class="alert alert-info"
                                        role="alert"
                                        v-if="loading"
                                    >
                                        <strong>Processing....</strong>
                                    </div>
                                </div>
                                <div
                                    class="alert alert-danger"
                                    role="alert"
                                    v-if="hasErrors"
                                >
                                    <strong
                                        v-for="error in errors"
                                        :key="error"
                                        >{{ error }}</strong
                                    >
                                </div>
                            </div>
                        </div>
                        <div class="col text-center mt-4">
                            <div class="my-3">
                                <button
                                    class="btn btn-outline-danger btn-lg mx-2"
                                    @click="loginwithGoogle"
                                >
                                    Login with Google
                                </button>
                            </div>
                            <div class="my-3">
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

<style scoped>
.login-page {
    background: #1d1c1d;
    height: 100vh;
}
.login-container {
    width: 750px;
    border-radius: 15px;
    overflow: hidden;
}
.login-right {
    padding: 30px;
}
.login-left {
    background: url("../assets/images/login-hero.png");
    background-position: 25%;
    background-repeat: no-repeat;
    background-size: cover;
}
</style>
