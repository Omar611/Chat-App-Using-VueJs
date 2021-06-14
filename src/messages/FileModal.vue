<template>
    <div>
        <!-- Modal -->
        <div
            class="modal fade"
            id="fileUploadModal"
            tabindex="-1"
            aria-labelledby="fileUploadModal"
            aria-hidden="true"
        >
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title text-dark font-weight-bold">
                            Upload Image <small>jpeg, png, 1mb max</small>
                        </h5>
                        <button
                            type="button"
                            class="close"
                            data-dismiss="modal"
                            aria-label="Close"
                        >
                            <span aria-hidden="true">&times;</span>
                        </button>
                    </div>

                    <div class="modal-body">
                        <form class="form">
                            <div class="input-group mb-3">
                                <!-- <div class="custom-file">
                                    <input
                                        type="file"
                                        name="file"
                                        id="file"
                                        @click="addFile"
                                        class="custom-file-input"
                                        aria-describedby="inputGroupFileAddon01"
                                    />
                                    <label
                                        class="custom-file-label"
                                        for="inputGroupFile01"
                                        >Choose file</label
                                    >
                                </div> -->
                                <input type="file" @change="addFile" />
                            </div>
                        </form>
                        <div
                            class="
                                alert alert-danger alert-dismissible
                                fade
                                show
                            "
                            role="alert"
                            v-for="(error, index) in errors"
                            :key="index"
                        >
                            <button
                                type="button"
                                class="close"
                                data-dismiss="alert"
                                aria-label="Close"
                            >
                                <span aria-hidden="true">&times;</span>
                                <span class="sr-only">Close</span>
                            </button>
                            <strong>{{ error }}</strong>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button
                            type="button"
                            class="btn btn-light border border-dark"
                            data-dismiss="modal"
                        >
                            Cancel
                        </button>
                        <button
                            type="button"
                            class="btn btn-dark"
                            @click="sendFile"
                        >
                            Send Image
                        </button>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import mime from "mime-types";

export default {
    name: "file-modal",
    props: ["errors"],
    data() {
        return {
            file: null,
            authorized: ["image/jpeg", "image/jpg", "image/png"],
        };
    },
    methods: {
        isValid(filename) {
            let index = this.authorized.indexOf(mime.lookup(filename));
            return index !== -1;
        },

        addFile(e) {
            let files = e.target.files;
            if (files.length === 1) {
                this.file = files[0];
            }
        },

        sendFile() {
            if (this.file !== null) {
                if (this.isValid(this.file.name)) {
                    const metadata = {
                        contentType: mime.lookup(this.file.name),
                    };
                    this.$parent.uploadFile(this.file, metadata);
                    $("#fileUploadModal").modal("hide");
                } else {
                    this.$emit(
                        "addError",
                        "File must be jpeg or png and 1mb max"
                    );
                }
            } else {
                this.$emit("addError", "Please select a file");
            }
        },
        getErrors(err) {
            this.erros = err;
        },
        // reset form
        resetForm() {
            $(".form").trigger("reset");
            this.file = null;
        },
    },
};
</script>













