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
                    :class="{ 'bg-light text-dark': isActive(user) }"
                    href="#"
                    @click.prevent="changeChannel(user)"
                >
                    <span>
                        <img
                            :src="user.avatar"
                            height="50px"
                            class="rounded-circle"
                            alt="avatar"
                        />
                    </span>
                    <h5 class="ml-2">
                        {{ user.name }}
                        <span
                            class="badge badge-light float-right ml-3"
                            v-if="getNotification(user) >= 1"
                            >{{ getNotification(user) }}</span
                        >
                    </h5>
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
import mixin from "@/mixins";

export default {
    name: "users",
    data() {
        return {
            users: [],
            usersRef: firebase.database().ref("users"),
            connectedRef: firebase.database().ref(".info/connected"),
            presenceRef: firebase.database().ref("presence"),
            PrivateMessagesRef: firebase.database().ref("privateMessages"),
            notifCount: [],
            channel: null,
            channels: [],
        };
    },
    mixins: [mixin],
    computed: {
        ...mapGetters(["getCurrentUser", "getCurrentChannel", "isPrivate"]),
    },
    watch: {
        isPrivate() {
            if (!this.isPrivate) {
                this.resetNotifications();
            }
        },
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
                    const channelId = this.getChannelID(snapshot.key);
                    this.PrivateMessagesRef.child(channelId).on(
                        "value",
                        (snapshot) => {
                            this.handelNotifications(
                                channelId,
                                this.getCurrentChannel.id,
                                this.notifCount,
                                snapshot
                            );
                        }
                    );
                }
            });

            // presenceRef child removed
            this.presenceRef.on("child_removed", (snapshot) => {
                if (this.getCurrentUser.uid !== snapshot.key) {
                    //  Pass to user status method
                    this.addStatusToUser(snapshot.key, false);
                    this.PrivateMessagesRef.child(
                        this.getChannelID(snapshot.key)
                    ).off();
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
                connected == true
                    ? (this.users[index].status = "online")
                    : (this.users[index].status = "offline");
            }
        },
        isonline(user) {
            return user.status === "online";
        },
        getChannelID(userId) {
            return userId < this.getCurrentUser.uid
                ? userId + "/" + this.getCurrentUser.uid
                : this.getCurrentUser.uid + "/" + userId;
        },
        resetNotifications(user = null) {
            let channelId = null;
            if (user !== null) {
                channelId = this.getChannelID(user.uid);
            } else {
                channelId = this.channel.id;
            }
            const index = this.notifCount.findIndex((el) => el.id == channelId);
            if (index !== -1) {
                this.notifCount[index].total =
                    this.notifCount[index].lastKnownTotal;
                this.notifCount[index].notif = 0;
            }
        },
        changeChannel(user) {
            if (this.channel == null) {
                this.resetNotifications(user);
            } else {
                this.resetNotifications();
            }
            const chanhelId = this.getChannelID(user.uid);
            const channel = { id: chanhelId, name: user.name };
            this.channel = channel;
            this.$store.dispatch("setPrivate", true);
            this.$store.dispatch("setCurrentChannel", channel);
        },
        isActive(user) {
            const channelId = this.getChannelID(user.uid);
            return this.getCurrentChannel.id === channelId;
        },
        getNotification(user) {
            const channelId = this.getChannelID(user.uid);
            let notif = 0;
            this.notifCount.forEach((el) => {
                if (el.id == channelId) {
                    notif = el.notif;
                }
            });
            return notif;
        },
        detachLinstners() {
            this.usersRef.off();
            this.presenceRef.off();
            this.connectedRef.off();
            this.PrivateMessagesRef.off();
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
