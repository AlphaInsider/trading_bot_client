<template>
  <div>
    <!-- Title -->
    <div class="overview">
      <div class="container">
        <div class="title row justify-content-center px-4">
          <div class="col-12">
            <div class="text-center">
              <h1 class="text-white">Broker API Key Tutorial</h1>
              <h5 class="text-white">Follow these steps to create your Broker's API keys for the trading bot.</h5>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Steps -->
    <div class="body">
      <div class="container">

        <!-- select broker service -->
        <div class="row justify-content-center">
          <div class="col-12 col-lg-8 d-flex justify-content-center">
            <!-- alpaca -->
            <div @click="broker = 'alpaca'" :class="{active: broker === 'alpaca'}" class="option-select card mr-3">
              <div class="card-body d-flex flex-column align-items-center justify-content-around">
                <img src="/img/brokers/alpaca-logo.png" alt="Alpaca" width="54">
              </div>
              <div class="card-footer text-center">
                <h6 class="mb-0">Alpaca</h6>
              </div>
            </div>
            <!-- tastytrade -->
            <div @click="broker = 'tastytrade'" :class="{active: broker === 'tastytrade'}" class="option-select card mr-3">
              <div class="card-body d-flex flex-column align-items-center justify-content-around">
                <img src="/img/brokers/tastytrade-logo.svg" alt="TastyTrade" width="125">
              </div>
              <div class="card-footer text-center">
                <h6 class="mb-0">TastyTrade</h6>
              </div>
            </div>
          </div>
        </div>

        <!-- Step 1 -->
        <div class="row justify-content-center mt-3">
          <div class="col-12 col-lg-8">
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <span class="badge badge-secondary mr-2">Step 1</span> Sign-up for Alpaca
              </div>
              <div v-if="broker === 'alpaca'" class="card-body">
                <p class="card-text">
                  Click the "<strong>Sign Up for Alpaca</strong>" button below to create or sign into your account with Alpaca.
                </p>
                <a href="https://app.alpaca.markets/signup" target="_blank" class="btn btn-primary px-5">Sign Up for Alpaca</a>
              </div>
              <div v-else-if="broker === 'tastytrade'" class="card-body">
                <p class="card-text">
                  Click the "<strong>Sign Up for TastyTrade</strong>" button below to create or sign into your account with TastyTrade.
                </p>
                <a href="https://tastytrade.com/" target="_blank" class="btn btn-primary px-5">Sign Up for TastyTrade</a>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Step 2 -->
        <div class="row justify-content-center mt-2">
          <div class="col-12 col-lg-8">
            <div class="card">
              <div class="card-header d-flex align-items-center">
                <span class="badge badge-secondary mr-2">Step 2</span> Generate API Keys
              </div>
              <div v-if="broker === 'alpaca'" class="card-body">
                From the dashboard:
                <ol class="card-text">
                  <li>On left side panel, click the <strong>Character</strong> dropdown menu.</li>
                  <li>From the dropdown, select <strong>Paper</strong>. This enables the paper trading account.</li>
                  <li>Select the <strong>Home</strong> tab from the left side panel.</li>
                  <li>On the right "<strong>Quick Trade</strong>" panel, click the <strong>View API Keys</strong> button.</li>
                  <li>Click the <strong>Generate</strong> button. This generates new Alpaca API keys.</li>
                  <li>Make a copy of both the <strong>API Key ID</strong> and <strong>Secret Key</strong>. You will use these with the trading bot.</li>
                </ol>
              </div>
              <div v-else-if="broker === 'tastytrade'" class="card-body">
                AlphaBot will request your TastyTrade login credentials (<strong>username</strong> and <strong>password</strong>) to create the Auth API tokens for you.
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
      broker: 'alpaca'
    }
  }
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
.body {
  margin-top: 100px;
  margin-bottom: 100px;
}
</style>