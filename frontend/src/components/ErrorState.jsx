function ErrorState({ onRetry }) { return <div className="empty-state"><span className="empty-icon">!</span><h2>We missed a beat</h2><p>We could not load the collection right now.</p><button className="button button-dark" type="button" onClick={onRetry}>Try again</button></div> }

export default ErrorState
