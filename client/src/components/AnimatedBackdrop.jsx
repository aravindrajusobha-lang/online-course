export default function AnimatedBackdrop() {
  return (
    <div className="animated-backdrop" aria-hidden="true">
      <div className="market-ticker market-ticker-top">
        <span className="ticker-label">SIMULATED MARKET</span>
        <span>NIFTY <b className="ticker-up">+0.82%</b></span>
        <span>BTC <b className="ticker-down">-0.34%</b></span>
        <span>NASDAQ <b className="ticker-up">+1.16%</b></span>
        <span>AI INDEX <b className="ticker-up">+2.08%</b></span>
        <span className="ticker-label">SIMULATED MARKET</span>
        <span>NIFTY <b className="ticker-up">+0.82%</b></span>
        <span>BTC <b className="ticker-down">-0.34%</b></span>
        <span>NASDAQ <b className="ticker-up">+1.16%</b></span>
        <span>AI INDEX <b className="ticker-up">+2.08%</b></span>
      </div>
      <div className="market-ticker market-ticker-bottom">
        <span>TECH SECTOR <b className="ticker-up">+0.64%</b></span>
        <span>DATA FLOW <b className="ticker-live">RUNNING</b></span>
        <span>LEARNING MODEL <b className="ticker-live">ACTIVE</b></span>
        <span>TECH SECTOR <b className="ticker-up">+0.64%</b></span>
        <span>DATA FLOW <b className="ticker-live">RUNNING</b></span>
        <span>LEARNING MODEL <b className="ticker-live">ACTIVE</b></span>
      </div>
      <div className="market-candles">
        <span /><span /><span /><span /><span /><span /><span /><span />
        <span /><span /><span /><span /><span /><span /><span /><span />
        <span /><span /><span /><span /><span /><span /><span /><span />
      </div>
      <div className="ai-network">
        <span className="network-label">AI / DATA / LEARNING</span>
        <span className="network-node node-one" />
        <span className="network-node node-two" />
        <span className="network-node node-three" />
        <span className="network-node node-four" />
        <span className="network-node node-five" />
        <span className="network-core">AI</span>
      </div>
    </div>
  );
}
