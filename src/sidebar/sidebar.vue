<template>
    <div>
        <nav
            class="
                navbar navbar-dark
                sticky-top
                flex-md-nowrap
                p-0
                shadow
                mobile-nav
            "
        >
            <!-- <a href="#"
                >Company name</a
            > -->
            <div
                class="navbar-brand col-md-3 col-lg-2 mr-0 px-4 hide-on-desktop"
            >
                <h2 class="text-light text-right">#Slack with VueJs#</h2>
            </div>
            <button
                class="
                    navbar-toggler
                    position-absolute
                    ml-1
                    mb-1
                    d-md-none
                    collapsed
                "
                type="button"
                data-toggle="collapse"
                data-target="#sidebarMenu"
                aria-controls="sidebarMenu"
                aria-expanded="false"
                aria-label="Toggle navigation"
            >
                <span class="navbar-toggler-icon"></span>
            </button>
        </nav>
        <nav id="sidebarMenu" class="d-md-block p-4 sidebar collapse" style="">
            <div class="sidebar-sticky">
                <h2 class="text-light text-center hide-on-mobile">
                    #Slack with VueJs#
                </h2>
                <p class="text-light text-center mb-4 hide-on-mobile">
                    Realtime communication at it's best
                </p>
                <div class="text-center my-3">
                    <span>
                        <img
                            :src="getCurrentUser.photoURL"
                            alt="user avatar"
                            class="rounded-circle mt2"
                            height="100px"
                        />
                    </span>
                    <span>
                        <h3
                            class="text-light"
                            v-text="getCurrentUser.displayName"
                        ></h3>
                    </span>
                </div>
                <div class="text-center">
                    <button @click="logout" class="btn btn-outline-light">
                        Logout
                    </button>
                </div>
                <hr class="bg-light m-4" />
                <channels />
                <hr class="bg-light m-4" />
                <users />
            </div>
        </nav>
    </div>
</template>

<script>
import auth from "firebase/auth";
import database from "firebase/database";
import { mapGetters } from "vuex";
import channels from "@/sidebar/Channels";
import users from "@/sidebar/Users";

export default {
    name: "sidebar",
    computed: {
        ...mapGetters(["getCurrentUser"]),
    },
    data() {
        return {
            presenceRef: firebase.database().ref("presence"),
        };
    },
    methods: {
        logout() {
            firebase.auth().signOut();
            this.presenceRef.child(this.getCurrentUser.uid).remove();
            this.$store.dispatch("setUser", null);
            setTimeout(() => {
                this.$router.push("/login");
            }, 100);
        },
    },
    components: {
        channels,
        users,
    },
};
</script>

<style scoped>
.sidebar {
    height: 100vh;
    background-color: #1d1c1d;
    overflow-y: auto;
    position: relative;
    z-index: 9999;
}
.sidebar::-webkit-scrollbar-track {
    border: 1px solid #000;
    padding: 2px 0;
    background-color: #404040;
}
.sidebar::-webkit-scrollbar {
    width: 12px;
}
.sidebar::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #737272;
    border: 1px solid #000;
}
.hide-on-desktop {
    display: none;
}
.mobile-nav {
    background-color: #1d1c1d;
}
@media (max-width: 767px) {
    .hide-on-desktop {
        display: block;
    }
    .hide-on-mobile {
        display: none;
    }
}
</style>
