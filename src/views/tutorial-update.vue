<template>
<div>
  <!-- Title -->
  <div class="overview">
    <div class="container">
      <div class="title row justify-content-center px-4">
        <div class="col-12">
          <div class="text-center">
            <h1 class="text-white">Update AlphaBot</h1>
            <h5 class="text-white">Follow these steps to update your AlphaBot application.</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Steps -->
  <div class="instructions-body">
    <div class="container">

      <!-- Deployment Select -->
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8 d-flex justify-content-center">
          <!-- Heroku -->
          <div @click="provider = 'heroku'" :class="{active: provider === 'heroku'}" class="option-select card mr-3">
            <div class="card-body d-flex flex-column align-items-center justify-content-around" style="background-color: #534292;">
              <img src="/img/heroku-logo.png" alt="Heroku" width="54">
            </div>
            <div class="card-footer text-center">
              <h6 class="mb-0">Heroku</h6>
            </div>
          </div>
          <!-- DigitalOcean -->
          <div @click="provider = 'digitalocean'" :class="{active: provider === 'digitalocean'}" class="option-select card">
            <div class="card-body d-flex flex-column align-items-center justify-content-center">
              <img src="/img/digitalocean-logo.svg" alt="DigitalOcean" width="60">
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
              <span class="badge badge-secondary mr-2">Step 1</span> Sign into {{ $_.capitalize(provider) }}
            </div>
            <div class="card-body">
              <p class="card-text">
                Navigate to the "<a :href="providerLink" target="_blank" class="link font-weight-bold">Application Dashboard</a>" and select the AlphaBot app.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="row justify-content-center mt-2">
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <span class="badge badge-secondary mr-2">Step 2</span> Update application
            </div>
            <div class="card-body">
              <!-- Heroku -->
              <p v-if="provider === 'heroku'" class="card-text">
                Once inside the application dashboard, click on the "<b>More</b>" dropdown button. Scroll down to "<b>Restart all dynos</b>" and click.
              </p>
              <!-- DigitalOcean -->
              <p v-else-if="provider === 'digitalocean'" class="card-text">
                Once inside the application dashboard, click on the "<b>Actions</b>" dropdown button. Scroll down to "<b>Force Rebuild and Deploy</b>" and click.
              </p>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 3 -->
      <div class="row justify-content-center mt-2">
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <span class="badge badge-secondary mr-2">Step 3</span> Reset AlphaBot
            </div>
            <div class="card-body">
              <p class="card-text">
                The application will automatically pull down the latest updates and redeploy. Head back to the AlphaBot website to see the latest changes.
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
      provider: 'heroku'
    }
  },
  computed: {
    providerLink() {
      return (this.provider === 'heroku' ? 'https://dashboard.heroku.com/apps' : 'https://cloud.digitalocean.com/apps');
    }
  },
}
</script>

<style lang="scss" scoped>
.overview {
  background-color: #051125;
}
.title {
  padding-top: 75px;
  padding-bottom: 75px;
}
.instructions-body {
  margin-top: 100px;
  margin-bottom: 100px;
}
.option-select {
  cursor: pointer;
  width: 150px;
  height: 150px;
  &.active {
    border: 1px solid var(--primary);
    box-shadow: 0 0 4px rgba(var(--primary-rgb), 1);
  }
}
</style>