<template>
    <div>
        <div class="jumbotron bg-primary text-white text-center">
            <h2 class="lead display-4">#Slack with VueJs#</h2>
            <p>Realtime communication at it's best</p>
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
                    <button class="btn btn-outline-info btn-lg mx-2">
                        Login with Twitter
                    </button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import auth from 'firebase/auth'
export default {
    name: "login",
    methods: {
        loginwithGoogle() {
            firebase
                .auth()
                .signInWithPopup(new firebase.auth.GoogleAuthProvider())
                .then((res) => console.log(res))
                .catch((err) => console.log(err));
        },
    },
};
</script>
