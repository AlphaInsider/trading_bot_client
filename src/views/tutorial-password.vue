<template>
<div>
  <!-- Title -->
  <div class="overview">
    <div class="container">
      <div class="title row justify-content-center px-4">
        <div class="col-12">
          <div class="text-center">
            <h1 class="text-white">Forgot Password</h1>
            <h5 class="text-white">Follow these steps to update your AlphaBot password.</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
  
  <!-- Steps -->
  <div class="instructions-body">
    <div class="container">
      <!-- Step 1 -->
      <div class="row justify-content-center">
        <div class="col-12 col-lg-8">
          <div class="card">
            <div class="card-header d-flex align-items-center">
              <span class="badge badge-secondary mr-2">Step 1</span> Sign into DigitalOcean
            </div>
            <div class="card-body">
              <p class="card-text">
                Navigate to the "<a href="https://cloud.digitalocean.com/apps" target="_blank" class="link font-weight-bold">Application Dashboard</a>" and select the AlphaBot app.
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
              <span class="badge badge-secondary mr-2">Step 2</span> Update password
            </div>
            <div class="card-body">
              <p class="card-text">
                Once inside the application dashboard, navigate to the "<b>Settings</b>" tab. Scroll down to "<b>App-Level Environment Variables</b>" and click on "<b>Edit</b>" text button. Update the value field next to the "<b>USER_PASSWORD</b>" key to change the password. Click the "<b>Save</b>" button to update the password.
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
                After saving, the application will update automatically with the new password. Head back to the application website to log into the bot with the new password.
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