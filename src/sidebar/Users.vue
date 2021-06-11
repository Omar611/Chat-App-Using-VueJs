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
                        align-items-center
                        border-bottom
                    "
                >
                  <span>
                    <img :src="user.avatar" height="50px" class="rounded-circle" alt="avatar">
                  </span>
                    <h5 class="ml-2">{{ user.name }}</h5>
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
        },
        detachLinstners() {},
    },
    mounted() {
        this.addLinstners();
    },
    beforeDestroy() {
        this.detachListeners();
    },
};
</script>
