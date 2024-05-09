<template>
<div>
  <!-- Title -->
  <div class="overview">
    <div class="container">
      <div class="title row justify-content-center px-4">
        <div class="col-12">
          <div class="text-center">
            <h1 class="text-white">Risk Disclaimer</h1>
            <h5 class="text-white">Last Update: December 13, 2023</h5>
          </div>
        </div>
      </div>
    </div>
  </div>
  <!-- Terms and Conditions -->
  <div class="my-5 mx-2 mx-lg-5">
    <div class="container">
      <div class="card">
        <div class="card-body p-3 p-lg-5 text-justify">
          <!-- Summary -->
          <h3>Summary</h3>
          <p>
            This document highlights the risks associated with using AlphaBot, a trading bot. Key points include market 
            volatility, reliance on the AlphaInsider strategy with no guarantee of future performance, dependence on 
            automation with reduced manual control, user responsibility for decision-making, and legal terms including 
            indemnification, governing law, and disclaimers. Activation of AlphaBot indicates your understanding and 
            acceptance of these risks and terms.
          </p>
          <h3>Introduction</h3>
          <p>
            This agreement outlines the terms and conditions of using AlphaBot, an open-source trading bot designed to 
            automate order execution between trading strategy alert services and brokerage platforms. Activation and use 
            of AlphaBot signify your understanding and acceptance of the following terms.
          </p>
          
          <h3>Risk Acknowledgement</h3>
          <ol>
            <li>Market Volatility: You acknowledge the inherent volatility of financial markets, including rapid price fluctuations, potential losses due to unforeseen "black swan" events, and the risk of technical issues within AlphaBot leading to financial losses.</li>
            <li>Open-Source Risks: You understand the risks associated with using an open-source tool like AlphaBot for connecting trade alert services to your brokerage account.</li>
            <li>You acknowledge that the performance of any vendor sending trade alerts linked to AlphaBot impacts your portfolio's performance. While these strategies may have performed well historically, AlphaBot does not guarantee successful performance and past performance is not indicative of future results. You accept the risk of potential losses if any of these strategies underperform or fail to meet your expectations. </li>
            <li>The alert services compatible with AlphaBot may not be registered broker-dealers and are not supervised by regulatory authorities like the SEC or FINRA.</li>
          </ol>
          
          <h3>User Responsibilities</h3>
          <ol>
            <li>You acknowledge and agree that your use of AlphaBot is for the express purpose of facilitating the independent management of your personal investments. AlphaBot functions as a tool to assist in the execution of your chosen investment strategies and decisions. It is important to understand that AlphaBot, as well as any connected external services, do not provide investment advice, guidance, nor undertake order execution as an agent or representative on your behalf. Consequently, you bear full responsibility for all your investment decisions, including the monitoring of your investment positions and the accurate processing of trade signals. While AlphaBot aids in these processes, it does not relieve you of the responsibility for these decisions and actions, which are made solely at your discretion and risk.</li>
            <li>By activating and using AlphaBot, you expressly authorize it to make changes, including trades and adjustments, within your brokerage account. You understand and accept that this may impact your ability to conduct manual trading of cash or reserves, thereby influencing your overall portfolio management.</li>
          </ol>
          
          <h3>Legal Terms</h3>
          <ol>
            <li>Indemnification: By using AlphaBot, you agree to indemnify and hold harmless its creators and any affiliated third parties from all claims, demands, suits, actions, liabilities, costs, losses, expenses, and damages that may arise from your use of AlphaBot.</li>
            <li>Governing Law: The terms and conditions of this agreement are governed by and construed in accordance with the laws of the State of Delaware, without regard to its conflict of law principles.</li>
            <li>Disclaimer of Warranties and Limitation of Liability: AlphaBot is provided "as is" and without any express or implied warranties. The creators of AlphaBot disclaim all warranties regarding the accuracy, reliability, completeness, or fitness for a particular purpose of AlphaBot. Furthermore, the creators shall not be liable for any direct, indirect, incidental, consequential, or punitive damages arising from your use of AlphaBot.</li>
            <li>While AlphaBot is an open-source project, users must comply with the terms of the specific open-source license under which it is released. This includes any restrictions on the use, modification, distribution, or creation of derivative works. Copyrights to the original work and trademarks, such as the name and logo of AlphaBot, are retained by the creators and must be respected in accordance with applicable laws.</li>
          </ol>
          
          <h3>Data Privacy</h3>
          <ol>
            <li>You agree to the collection and use of your data in accordance with The Bot's <router-link to="/privacy-policy">Privacy Policy</router-link>, which includes storing data related to your portfolio and trading activities.</li>
          </ol>
          
          <p><strong>By activating AlphaBot, you acknowledge that you have read, understood, and agree to the Risk Disclaimer outlined in this document.</strong></p>
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
</style>