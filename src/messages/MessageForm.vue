<template>
    <div>
        <div class="messageForm">
            <div class="progress">
                <div
                    class="
                        progress-bar progress-bar-striped progress-bar-animated
                    "
                    role="progressbar"
                >
                    {{ uploadLabel }}
                </div>
            </div>
            <form @submit.prevent="sendMessage">
                <div class="input-group">
                    <div class="input-group-prepend">
                        <span class="input-group-text">></span>
                    </div>
                    <textarea
                        name="message"
                        id="message"
                        cols="15"
                        rows="1"
                        class="form-control write-message"
                        placeholder="Don't be shy wirte something..."
                        v-model="message"
                        @keydown.enter.exact.prevent
                        @keyup.enter.exact="sendMessage"
                    ></textarea>
                    <emoji-picker @emoji="insert" :search="search">
                        <div
                            slot="emoji-invoker"
                            slot-scope="{ events: { click: clickEvent } }"
                            @click.stop="clickEvent"
                        >
                            <svg
                                class="emoji-btn"
                                height="24"
                                viewBox="0 0 24 24"
                                width="24"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path d="M0 0h24v24H0z" fill="none" />
                                <path
                                    d="M11.99 2C6.47 2 2 6.48 2 12s4.47 10 9.99 10C17.52 22 22 17.52 22 12S17.52 2 11.99 2zM12 20c-4.42 0-8-3.58-8-8s3.58-8 8-8 8 3.58 8 8-3.58 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"
                                />
                            </svg>
                        </div>
                        <div
                            class="emoji-picker"
                            slot="emoji-picker"
                            slot-scope="{ emojis, insert, display }"
                        >
                            <div>
                                <div>
                                    <input
                                        type="text"
                                        class="form-control"
                                        placeholder="Search Emojis"
                                        v-model="search"
                                    />
                                </div>
                                <div>
                                    <div
                                        v-for="(emojiGroup, category) in emojis"
                                        :key="category"
                                    >
                                        <h5
                                            class="
                                                my-2
                                                text-light
                                                font-weight-bolder
                                            "
                                        >
                                            {{ category }}
                                        </h5>
                                        <div
                                            class="
                                                d-flex
                                                flex-wrap
                                                justify-center
                                            "
                                        >
                                            <span
                                                v-for="(
                                                    emoji, emojiName
                                                ) in emojiGroup"
                                                :key="emojiName"
                                                @click="insert(emoji)"
                                                :title="emojiName"
                                                >{{ emoji }}</span
                                            >
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </emoji-picker>
                    <div class="input-group-append">
                        <button
                            type="button"
                            class="btn btn-primary"
                            @click="sendMessage"
                            @keyup.16="sendMessage"
                        >
                            &nbsp; Send &nbsp;
                        </button>
                    </div>
                    <div class="input-group-append">
                        <button
                            type="button"
                            class="btn btn-warning"
                            data-toggle="fileUploadModal"
                            data-target="#fileUploadModal"
                            @click.prevent="openFileUploadModal"
                            :disabled="uploadState == 'uploading'"
                        >
                            Upload
                        </button>
                    </div>
                </div>
            </form>
        </div>
        <!-- file modal -->
        <file-modal ref="file_modal" :errors="errors" @addError="addError" />
    </div>
</template>

<script>
import { mapGetters } from "vuex";
import EmojiPicker from "vue-emoji-picker";
import FileModal from "./FileModal";
import storage from "firebase/storage";

export default {
    name: "message-form",
    data() {
        return {
            message: "",
            errors: [],
            search: "",
            storageRef: firebase.storage().ref(),
            uploadTask: null,
            uploadState: null,
        };
    },
    components: {
        EmojiPicker,
        FileModal,
    },
    computed: {
        ...mapGetters(["getCurrentUser", "getCurrentChannel", "isPrivate"]),
        uploadLabel() {
            switch (this.uploadState) {
                case "uploading":
                    return "Uploading...";
                    break;
                case "error":
                    return "Error occured";
                    break;
                case "done":
                    return "Upload completed";
                    break;
                default:
                    return "";
            }
        },
    },
    methods: {
        sendMessage() {
            // Validation before pushing message
            if (this.getCurrentChannel !== null && this.message.length > 0) {
                this.$parent
                    .getMessagesRef()
                    .child(this.getCurrentChannel.id)
                    .push()
                    // .set(newMessage)
                    .set(this.createMessage())
                    .then(() => {
                        this.$nextTick(() => {
                            this.scrollToLastMessage();
                        });
                    })
                    .catch((err) => {
                        this.errors.push(err.message);
                    });
                this.message = "";
            }
        },
        scrollToLastMessage() {
            var innerContainer = document.querySelector(
                ".inner-messages-container"
            );
            innerContainer.scrollTop = innerContainer.scrollHeight;
        },
        insert(emoji) {
            this.message += emoji;
        },
        openFileUploadModal() {
            $("#fileUploadModal").modal("show");
        },
        createMessage(fileUrl = null) {
            // create message object to push to firebase
            let message = {
                timestamp: firebase.database.ServerValue.TIMESTAMP,
                user: {
                    name: this.getCurrentUser.displayName,
                    avatar: this.getCurrentUser.photoURL,
                    id: this.getCurrentUser.uid,
                },
            };

            if (fileUrl == null) {
                // either send message with content
                message["content"] = this.message;
            } else {
                // or send the message with image
                message["image"] = fileUrl;
                $(".progress").hide();
            }
            return message;
        },
        uploadFile(file, metadata) {
            if (file === null) return false;
            const pathToUpload = this.getCurrentChannel.id;
            const ref = this.$parent.getMessagesRef();
            const filePath = this.getPath() + "/" + this.uniqueId() + ".jpg";

            this.uploadTask = this.storageRef
                .child(filePath)
                .put(file, metadata);

            this.uploadState = "uploading";

            this.uploadTask.on(
                "state_changed",
                (snapshot) => {
                    // Upload in progress
                    const percentage =
                        (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
                    $(".progress").show();
                    $(".progress-bar").css("width", percentage + "%");
                },
                (err) => {
                    this.errors.push(err);
                    this.uploadState = "error";
                    this.uploadTask = null;
                    // reset form
                    this.$refs.file_modal.resetForm();
                },
                () => {
                    // upload finished
                    this.uploadState = "done";
                    // reset form
                    this.$refs.file_modal.resetForm();
                    // recover the url of file
                    const fileUrl = this.uploadTask.snapshot.ref
                        .getDownloadURL()
                        .then((fileUrl) => {
                            this.sendFileMessage(fileUrl, ref, pathToUpload);
                        });
                }
            );
        },
        sendFileMessage(fileUrl, ref, pathToUpload) {
            ref.child(pathToUpload)
                .push()
                .set(this.createMessage(fileUrl))
                .then(() => {
                    this.$nextTick(() => {
                        this.scrollToLastMessage();
                    });
                })
                .catch((error) => {
                    this.errors.push(error.message);
                });
        },
        // Folder directory tostore files
        getPath() {
            if (this.isPrivate) {
                return "chat/private/" + this.getCurrentChannel.id;
            } else {
                return "chat/public/" + this.getCurrentChannel.id;
            }
        },
        uniqueId() {
            return (
                Math.random().toString(36).substr(2, 9) +
                "_" +
                Math.random().toString(36).substr(2, 9)
            );
        },
        addError(err) {
            this.errors.push(err);
        },
    },
    beforeDestroy() {
        if (this.uploadTask !== null) {
            this.uploadTask.cancel();
            this.uploadTask = null;
        }
    },
};
</script>

<style scoped>
.messageForm {
    position: fixed;
    bottom: 0;
    right: 0;
    left: 0;
}
.emoji-invoker {
    position: absolute;
    top: 0.5rem;
    right: 0.5rem;
    width: 1.5rem;
    height: 1.5rem;
    border-radius: 50%;
    cursor: pointer;
    transition: all 0.2s;
}
.emoji-invoker:hover {
    transform: scale(1.1);
}
.emoji-invoker > svg {
    fill: #b1c6d0;
}
svg.emoji-btn {
    cursor: pointer;
    position: absolute;
    right: 160px;
    bottom: 8px;
    z-index: 999;
}
.emoji-picker {
    position: absolute;
    z-index: 9999;
    border: 1px solid #ccc;
    width: 14rem;
    height: 20rem;
    overflow-y: scroll;
    padding: 1rem;
    box-sizing: border-box;
    border-radius: 0.5rem;
    background: #3f3e3f;
    box-shadow: 1px 1px 8px #c7dbe6;
    bottom: 37px;
    right: 77px;
}
.emoji-picker::-webkit-scrollbar-track {
    border: 1px solid #000;
    padding: 2px 0;
    background-color: #404040;
}
.emoji-picker::-webkit-scrollbar {
    width: 10px;
}
.emoji-picker::-webkit-scrollbar-thumb {
    border-radius: 10px;
    box-shadow: inset 0 0 6px rgba(0, 0, 0, 0.3);
    background-color: #737272;
    border: 1px solid #000;
}

.emoji-picker span {
    cursor: pointer;
}
.emoji-picker input {
    height: 33px;
}

.emoji-picker__search {
    display: flex;
}
.emoji-picker__search > input {
    flex: 1;
    border-radius: 10rem;
    border: 1px solid #ccc;
    padding: 0.5rem 1rem;
    outline: none;
}
.emoji-picker h5 {
    margin-bottom: 0;
    color: #b1b1b1;
    text-transform: uppercase;
    font-size: 0.8rem;
    cursor: default;
}
.emoji-picker .emojis {
    display: flex;
    flex-wrap: wrap;
    justify-content: space-between;
}
.emoji-picker .emojis:after {
    content: "";
    flex: auto;
}
.emoji-picker .emojis span {
    padding: 0.2rem;
    cursor: pointer;
    border-radius: 5px;
}
.emoji-picker .emojis span:hover {
    background: #ececec;
    cursor: pointer;
}
.progress {
    display: none;
}
.progress-bar {
    height: 100%;
}
@media (min-width: 768px) {
    .messageForm {
        left: 25%;
    }
    input:focus,
    button:active,
    button:focus {
        box-shadow: unset;
    }
    .write-message {
        max-height: 38px;
    }
}
</style>
