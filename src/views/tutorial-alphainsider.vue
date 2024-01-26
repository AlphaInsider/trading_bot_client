<template>
<div>
  <!-- Title -->
  <div class="overview">
    <div class="container">
      <div class="title row justify-content-center px-4">
        <div class="col-12">
          <div class="text-center">
            <h1 class="text-white">AlphaInsider API Key Tutorial</h1>
            <h5 class="text-white">Follow these steps to create an AlphaInsider API key for the trading bot.</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Steps -->
  <div class="instructions-body">
    <div class="container">

      <!-- Tutorial Video -->
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <div class="embed-responsive embed-responsive-16by9">
            <iframe class="embed-responsive-item trading-bot-video" src="https://www.youtube.com/embed/rezdx0KpwSI?si=ZQ52GzpunUFUzTYX&rel=0" title="Connecting AlphaInsider to your broker" allowfullscreen></iframe>
          </div>
        </div>
      </div>
      
      <!-- Step 1 -->
      <div class="row justify-content-center mt-3">
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <span class="badge badge-secondary mr-2">Step 1</span> Sign-up for AlphaInsider
            </div>
            <div class="card-body">
              <p class="card-text">
                Create an account with AlphaInsider using an email and password. Verify your email by clicking the <span class="font-weight-bold">Verify Email Address</span> button in the email that is sent to you after sign up.
              </p>
              <a href="https://alphainsider.com/sign-up" target="_blank" class="btn btn-primary px-5">Sign Up</a>
            </div>
          </div>
        </div>
      </div>

      <!-- Step 2 -->
      <div class="row justify-content-center mt-2">
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <span class="badge badge-secondary mr-2">Step 2</span> Navigate to developer settings page
            </div>
            <div class="card-body">
              <p class="card-text">
                Once logged in, navigate to the "<a href="https://alphainsider.com/settings/developers" class="link font-weight-bold">Developer Settings</a>" page. Click on "<span class="font-weight-bold">Settings</span>" tab, top-right for desktop or bottom-right gear icon for mobile. Then click on "<span class="font-weight-bold">Developers</span>".
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
              <span class="badge badge-secondary mr-2">Step 3</span> Create API key
            </div>
            <div class="card-body">
              <p class="card-text">
                From the "<span class="font-weight-bold">New API Key</span>" section, enter a "<span class="font-weight-bold">Name</span>" for the API key then select the following from the "<span class="font-weight-bold">Permissions</span>" dropdown:
              </p>
              <ul>
                <li><span class="font-weight-bold">bot > tradingBot</span>: This gives permission for AlphaBot to have access to permissions specific for watching AlphaInsider strategies.</li>
              </ul>
              <p class="card-text">
                Once the name and permissions are set, click on the "<span class="font-weight-bold">Create Key</span>" button.
              </p>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Step 4 -->
      <div class="row justify-content-center mt-2">
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <span class="badge badge-secondary mr-2">Step 4</span> Copy API key
            </div>
            <div class="card-body">
              <p class="card-text">
                After clicking the "<span class="font-weight-bold">Create Key</span>" button, a modal will appear with the API key in the text input box. Copy this key and save it somewhere safe, then add it to AlphaInsider API Key section on the bot.
                <br><br>
                <span class="font-weight-bold">Note:</span> This API key will not be viewable again. You will need to delete the old key then create a new one if you loose it.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</div>
</template>

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
</style>