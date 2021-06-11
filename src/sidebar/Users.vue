<template>
    <div>
        <h3 class="text-light m-2 text-center">Users</h3>

        <div class="users-list">
            <div v-for="user in users" :key="user.uid">
                <a
                    class="
                        text-light
                        px-3
                        py-1
                        d-block
                        text-decoration-none
                        d-flex
                        align-items-baseline
                        border-bottom
                    "
                    href="#"
                >
                    <span>
                        <img
                            :src="user.avatar"
                            height="50px"
                            class="rounded-circle"
                            alt="avatar"
                        />
                    </span>
                    <h5 class="ml-2">{{ user.name }}</h5>
                    <span class="online" v-if="isonline(user)"></span>
                    <span class="offline" v-else></span>
                </a>
            </div>
        </div>
    </div>
</template>

<script>
import databse from "firebase/database";
import { mapGetters } from "vuex";

export default {
    name: "users",
    data() {
        return {
            users: [],
            usersRef: firebase.database().ref("users"),
            connectedRef: firebase.database().ref(".info/connected"),
            presenceRef: firebase.database().ref("presence"),
        };
    },
    computed: {
        ...mapGetters(["getCurrentUser"]),
    },
    methods: {
        addLinstners() {
            this.usersRef.on("child_added", (snapshot) => {
                if (this.getCurrentUser.uid !== snapshot.key) {
                    // Build a user object
                    let user = snapshot.val();
                    user["uid"] = snapshot.key;
                    user["status"] = "offline";
                    this.users.push(user);
                }
            });

            // presenceRef child added
            this.presenceRef.on("child_added", (snapshot) => {
                if (this.getCurrentUser.uid !== snapshot.key) {
                    //  Pass to user status method
                    this.addStatusToUser(snapshot.key);
                }
            });

            // presenceRef child removed
            this.presenceRef.on("child_removed", (snapshot) => {
                if (this.getCurrentUser.uid !== snapshot.key) {
                    //  Pass to user status method
                    this.addStatusToUser(snapshot.key, false);
                }
            });
            // Return connected for each connected user
            this.connectedRef.on("value", (snapshot) => {
                if (snapshot.val() === true) {
                    let ref = this.presenceRef.child(this.getCurrentUser.uid);
                    ref.set(true);
                    ref.onDisconnect().remove();
                }
            });
        },
        addStatusToUser(userId, connected = true) {
            const index = this.users.findIndex((user) => user.uid === userId);
            if (index !== -1) {
                console.log(index);
                connected == true
                    ? (this.users[index].status = "online")
                    : (this.users[index].status = "offline");
            }
            console.log(this.users);
        },
        isonline(user) {
            return user.status === "online";
        },
        detachLinstners() {
            this.usersRef.off();
            this.presenceRef.off();
            this.connectedRef.off();
        },
    },
    mounted() {
        this.addLinstners();
    },
    beforeDestroy() {
        this.detachLinstners();
    },
};
</script>

<style scoped>
.online {
    height: 12px;
    width: 12px;
    background-color: rgb(59, 187, 59);
    border-radius: 50%;
    margin-left: auto;
}
.offline {
    height: 12px;
    width: 12px;
    background-color: rgb(235, 59, 59);
    border-radius: 50%;
    margin-left: auto;
}
</style>
