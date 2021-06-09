<template>
    <div>
        <h2 class="text-light text-center">#Slack with VueJs#</h2>
        <p class="text-light text-center mb-5">
            Realtime communication at it's best
        </p>
        <div class="text-center my-4">
            <span>
                <img
                    :src="getCurrentUser.photoURL"
                    alt="user avatar"
                    class="rounded-circle mt2"
                    height="100px"
                />
            </span>
            <span>
                <h3 class="text-light" v-text="getCurrentUser.displayName"></h3>
            </span>
        </div>
        <div class="text-center">
            <button @click="logout" class="btn btn-outline-light">
                Logout
            </button>
        </div>
        <hr class="bg-light m-4" />
    </div>
</template>

<script>
import auth from "firebase/auth";
import { mapGetters } from "vuex";

export default {
    name: "sidebar",
    computed: {
        ...mapGetters(["getCurrentUser"]),
    },
    methods: {
        logout() {
            firebase.auth().signOut();
            this.$store.dispatch("setUser", null);
            setTimeout(() => {
                this.$router.push("/login");
            }, 100);
        },
    },
};
</script>

<style scoped>
</style>
