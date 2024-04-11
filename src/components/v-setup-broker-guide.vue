<template>
<div>
  <!-- Alpaca -->
  <div v-if="broker === 'alpaca'">
    <div class="embed-responsive embed-responsive-16by9 rounded-lg">
      <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/bcXoLpWJE7A?si=yUD7d7BU8XcezhMD&rel=0&modestbranding=1" allowfullscreen></iframe>
    </div>
    <h5 class="mt-3">How to connect Alpaca to AlphaBot</h5>
    <ol>
      <li class="mt-2">Before connecting Alpaca to AlphaBot, decide whether you want to use a live account or a paper trading account.</li>
      <li class="mt-2">To connect a live trading account that uses real funds, click the dropdown in the upper left hand corner and select <span class="font-weight-bolder font-italic">"live"</span>.</li>
      <li class="mt-2">To connect a paper trading account which uses simulated funds, use the dropdown to select <span class="font-weight-bolder font-italic">"paper"</span> before generating your API keys.</li>
      <li class="mt-2">In the box labeled <span class="font-weight-bolder font-italic">"API keys"</span>, click the button that says regenerate.</li>
      <li class="mt-2">Then, click <span class="font-weight-bolder font-italic">"generate new keys"</span>.</li>
      <li class="mt-2">To complete the process, copy and paste your API public key and private key into the corresponding fields on AlphaBot.</li>
      <li class="mt-2">Click <span class="font-weight-bolder font-italic">"Save"</span> to move onto the next step.</li>
    </ol>
  </div>
  
  <!-- TastyTrade -->
  <div v-else-if="broker === 'tastytrade'">
    <div class="embed-responsive embed-responsive-16by9 rounded-lg">
      <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/VT1cH81GW8g?si=4V396GZKxjQGMsbx&rel=0&modestbranding=1" allowfullscreen></iframe>
    </div>
    <h5 class="mt-3">How to connect TastyTrade to AlphaBot</h5>
    <ol>
      <li class="mt-2">In your TastyTrade Account, hover over the <span class="font-weight-bolder font-italic">"My Profile"</span> tab in the upper right hand corner and select <span class="font-weight-bolder font-italic">"API"</span>.</li>
      <li class="mt-2">Check the box and opt in to tasty trade’s open API access.</li>
      <li class="mt-2">Under the <span class="font-weight-bolder font-italic">"My Accounts"</span> tab, select balances.</li>
      <li class="mt-2">Copy the Account ID for the account you wish to use for autotrading.</li>
      <li class="mt-2">In AlphaBot, select TastyTrade as the broker.</li>
      <li class="mt-2">Enter the same login credentials you use to access your TastyTrade account.</li>
      <li class="mt-2">Paste your account ID in the corresponding field labeled <span class="font-weight-bolder font-italic">"Account ID"</span>.</li>
      <li class="mt-2">Click <span class="font-weight-bolder font-italic">"Save"</span> to move onto the next step.</li>
    </ol>
  </div>
  
  <!-- Bitfinex-->
  <div v-else-if="broker === 'bitfinex'">
    <div class="embed-responsive embed-responsive-16by9 rounded-lg">
      <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/9AvsQ_0RYEY?si=VTYCLOlw_gqVfkvC&rel=0&modestbranding=1" allowfullscreen></iframe>
    </div>
    <!-- Setup paper trading -->
    <h5 class="mt-3">How to setup paper trading <span class="font-weight-bolder font-italic text-danger">(optional)</span></h5>
    <ol>
      <li class="mt-2">
        To create a sub-account for paper trading, navigate to the drop down in the upper right hand corner and click on <span class="font-weight-bolder font-italic">"Sub-Accounts"</span>.
      </li>
      <li class="mt-2">Click <span class="font-weight-bolder font-italic">"Create new sub-account"</span>.</li>
      <li class="mt-2">Fill in the fields with a unique username and email. You can simply append the same email address you use for Bitfinex by adding a +1 before the @ symbol (Ex: your_email+1@gmail.com).</li>
      <li class="mt-2">When you’ve filled in the fields click <span class="font-weight-bolder font-italic">"Next"</span>.</li>
      <li class="mt-2">You will need to check your email and click the link from Bitfinex to verify your new paper trading sub-account.</li>
      <li class="mt-2">Now click into your sub account. You will need to agree to the terms and setup a new two factor authentication specific to this paper trading account.</li>
    </ol>
    <!-- Setup API key-->
    <h5 class="mt-3">How to connect Bitfinex to AlphaBot</h5>
    <ol>
      <li class="mt-2">
        To connect Bitfinex to AlphaBot, navigate to the dropdown in the upper right hand corner of your Bitfinex account.
      </li>
      <li class="mt-2">Click on API Keys.</li>
      <li class="mt-2">Select the tab that says create new key.</li>
      <li class="mt-2">Turn on <span class="font-weight-bolder font-italic">"Create and cancel orders"</span>.</li>
      <li class="mt-2">Turn on <span class="font-weight-bolder font-italic">"Claim a position"</span>.</li>
      <li class="mt-2">Turn on <span class="font-weight-bolder font-italic">"Offer, cancel and close funding"</span>.</li>
      <li class="mt-2">Name your key and click <span class="font-weight-bolder font-italic">"Generate API Key"</span>.</li>
      <li class="mt-2">Complete the two factor authentication.</li>
      <li class="mt-2">Check your email for a link to your new set of API keys.</li>
      <li class="mt-2">To complete the process, copy and paste your API public key and secret key into the corresponding fields on AlphaBot.</li>
      <li class="mt-2">Click <span class="font-weight-bolder font-italic">"Save"</span> to move onto the next step.</li>
    </ol>
  </div>
  
  <!-- Binance-->
  <div v-else-if="broker === 'binance'">
    <div class="embed-responsive embed-responsive-16by9 rounded-lg">
      <iframe class="embed-responsive-item" src="https://www.youtube.com/embed/EGs9BjnehaE?si=fvv_EqUpXhRlrzwS&rel=0&modestbranding=1" allowfullscreen></iframe>
    </div>
    <h5 class="mt-3">How to connect Binance to AlphaBot</h5>
    <ol>
      <li class="mt-2">Login to Binance.</li>
      <li class="mt-2">In the left sidebar click on the account dropdown.</li>
      <li class="mt-2">Click on API management.</li>
      <li class="mt-2"><span class="font-weight-bolder font-italic"><span class="text-danger">IMPORTANT</span> Uncheck the box to deactivate default security controls.</span></li>
      <li class="mt-2">Confirm the change. Binance may ask you to complete 2FA each time you make a change like this.</li>
      <li class="mt-2">Click <span class="font-weight-bolder font-italic">"Create API"</span> in the upper right hand corner.</li>
      <li class="mt-2">Leave <span class="font-weight-bolder font-italic">"system generated"</span> enabled and click next.</li>
      <li class="mt-2">Name your API Key.</li>
      <li class="mt-2"><span class="font-weight-bolder font-italic"><span class="text-danger">IMPORTANT</span> Check the box under API Restrictions to enable spot and margin trading. Click save.</span></li>
      <li class="mt-2">To complete the process, copy and paste your API public key and secret key into the corresponding fields on AlphaBot.</li>
      <li class="mt-2">Click <span class="font-weight-bolder font-italic">"Save"</span> to move onto the next step.</li>
    </ol>
  </div>
  
  <p>Need help? <a href="https://alphainsider.freshdesk.com/support/tickets/new" target="_blank">Contact Us</a></p>
</div>
</template>

<script>
export default {
  props: {
    broker: {type: String, default: 'alpaca'}
  }
}
</script>