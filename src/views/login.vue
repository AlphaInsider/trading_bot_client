<template>
<div class="container my-3 my-lg-4">
  <div class="row align-items-center justify-content-center min-vh-100">
    <div class="login text-center">
      <!-- logo -->
      <v-logo :font-size="5"></v-logo>
      <h4 class="mt-3">Welcome Back</h4>
      <!-- login -->
      <p>Enter your password to continue</p>
      <validation-observer v-slot="event">
        <form @submit.prevent="event.handleSubmit(() => login(event))">
          <div class="row no-gutters mb-3">
            <!-- password -->
            <div class="col-10 pr-2">
              <validation-provider name="password" rules="required" v-slot="{ errors }">
                <input
                v-model="password"
                type="password"
                :class="{'is-invalid': errors.length}"
                class="form-control"
                placeholder="Password"
                >
                <div class="invalid-feedback">{{ errors[0] }}</div>
              </validation-provider>
            </div>
            <!-- login button -->
            <div class="col-2">
              <button type="submit" class="btn btn-block btn-primary"><i class="fas fa-arrow-right"></i></button>
            </div>
          </div>
        </form>
      </validation-observer>
      <!-- forgot password -->
      <router-link to="/forgot-password">Forgot Password?</router-link>
    </div>
  </div>
</div>
</template>


<script>
import vLogo from '@/components/v-logo.vue';
export default {
  components: {vLogo},
  data() {
    return {
      password: ''
    }
  },
  methods: {
    login(event) {
      //request login
      return this.$store.dispatch('request', {
        type: 'post',
        auth: false,
        url: 'login',
        query: {
          password: this.password
        }
      })
      //success
      .then(async (data) => {
        // set tokens
        await this.$store.dispatch('setTokens', {authToken: data.auth_token});
        // get bot information
        await this.$store.dispatch('getBotInfo');
        // get allocation
        await this.$store.dispatch('getAllocation');

        // redirect
        // check if redirect in url bar
        if(this.$route.query.redirect && this.$route.query.redirect !== this.$route.path) return this.$router.replace(this.$route.query.redirect);
        // redirect to setup if no alphainsider, no broker, or no allocation set
        else if(!this.$store.state.bot.alphainsider || !this.$store.state.bot.broker || this.$store.state.allocation.length <= 0) return this.$router.replace('/setup');
        // otherwise, redirect to home
        else return this.$router.replace('/');
      })
      //error, reset form
      .catch((error) => {
        toastr.error('Failed to login. Please try again.');
        this.password = '';
      });
    }
  }
}
</script>


<style lang="scss" scoped>
.login {
  width: 350px;
}
</style>