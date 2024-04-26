<template>
  <div class="hello">
    <form enctype="multipart/form-data">
      <input type="file" ref="fileInput" name="file" multiple="" v-on:change="fileChange($event.target.files)"/>
      <button type="button" v-if="isUploading" @click="upload()">Upload</button>
    </form>
  </div>
</template>

<script>
import axios from "axios";
export default {
  name: "HelloWorld",
  data() {
    return {
      files: null,
      isUploading: false,
    }
  },
  methods: {
    fileChange(fileList) {
      this.files = fileList[0];
      this.isUploading = true;
    },
    upload() {
      let files = new FormData();
      files = this.files;
      // eslint-disable-next-line no-unused-vars
      const connection = axios.create({
        baseURL: "https://localhost:44397/api/X/Upload",
        timeout: 300000,
        withCredentials: true,
        headers: {
          'Cache-Control': null,
          'X-Requested-With': null,
        },
      });
      axios.post("https://localhost:44374/api/X/Upload", files,
          {
            headers: {
              'Content-Type': 'multipart/form-data'
            }
          }).then(response => {
            console.log(response);
      }).catch(error => {
        console.log(error);
      });
      this.files = null;
      this.$refs.fileInput.value = null
      this.isUploading = false;
    },
  }
};
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped>
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
