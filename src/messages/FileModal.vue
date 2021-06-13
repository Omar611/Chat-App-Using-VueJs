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
                        <form>
                            <div class="input-group mb-3">
                                <div class="custom-file">
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
                                </div>
                            </div>
                        </form>
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
export default {
    name: "file-modal",
    data() {
        return {
            file: null,
        };
    },
    methods: {
        addFile(e) {
            //
        },
        sendFile() {
            //
        },
    },
};
</script>
