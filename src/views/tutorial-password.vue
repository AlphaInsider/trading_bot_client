<template>
<div>
  <!-- Title -->
  <div class="overview">
    <div class="container">
      <div class="instructions-title row justify-content-center px-4">
        <div class="col-12 col-lg-8">
          <div class="text-center">
            <h1 class="text-white">Reset Password</h1>
            <h5 class="text-white">Follow these steps to reset your password for the trading bot.</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Steps -->
  <div class="instructions-body">
    <div class="container">
      
      <!-- select hosting service -->
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 d-flex justify-content-center">
          <!-- heroku -->
          <div @click="host = 'heroku'" :class="{active: host === 'heroku'}" class="option-select card mr-3">
            <div class="card-body d-flex flex-column align-items-center justify-content-around" style="background-color: #534292;">
              <img src="/img/hosts/heroku-logo.png" alt="Heroku" width="54">
            </div>
            <div class="card-footer text-center">
              <h6 class="mb-0">Heroku</h6>
            </div>
          </div>
          <!-- digitalocean -->
          <div @click="host = 'digitalocean'" :class="{active: host === 'digitalocean'}" class="option-select card mr-3">
            <div class="card-body d-flex flex-column align-items-center justify-content-around">
              <img src="/img/hosts/digitalocean-logo.svg" alt="DigitalOcean" width="54">
            </div>
            <div class="card-footer text-center">
              <h6 class="mb-0">DigitalOcean</h6>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 1 -->
      <div class="row justify-content-center mt-3">
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <span class="badge badge-secondary mr-2">Step 1</span> Log in and navigate to hosted app
            </div>
            <div class="card-body">
              <p class="card-text">
                Log into your trading bot service provider's developer portal. Then navigate to the "<span class="font-weight-bold">Apps</span>" dashboard.
              </p>
              <a v-if="host === 'heroku'" href="https://dashboard.heroku.com/apps" target="_blank" class="btn btn-primary px-5">View Dashboard</a>
              <a v-else-if="host === 'digitalocean'" href="https://cloud.digitalocean.com/apps" target="_blank" class="btn btn-primary px-5">View Dashboard</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="row justify-content-center mt-2">
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <span class="badge badge-secondary mr-2">Step 2</span> Update password ENV variable
            </div>
            <div class="card-body">
              <p v-if="host === 'digitalocean'" class="card-text">
                Click on the app the trading bot is running on. Next, click on the "<span class="font-weight-bold">Settings</span>" tab
                and click the "<span class="font-weight-bold">Edit</span>" button next to "<span class="font-weight-bold">App-Level Environment Variables</span>".
                <br><br>
                Here you will see a list of keys and values. Update the "<span class="font-weight-bold">PASSWORD</span>" key value field with the new password.
                <br><br>
                Once complete, click the "<span class="font-weight-bold">Save</span>" button to redeploy application with the new password.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>


<script>
export default {
  data() {
    return {
      host: 'heroku'
    }
  }
}
</script>

<style lang="scss" scoped>
.overview {
  background-color: #051125;
}
.instructions-title {
  padding-top: 75px;
  padding-bottom: 75px;
}
.instructions-body {
  margin-top: 100px;
  margin-bottom: 100px;
}
</style>