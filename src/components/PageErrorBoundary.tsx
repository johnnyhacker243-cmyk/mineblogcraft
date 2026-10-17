import { Component, type ErrorInfo, type ReactNode } from "react";

// Keep the shared navigation and background mounted if one content page fails.
// Recovery controls use native text, so they also work if a text renderer fails.
export class PageErrorBoundary extends Component<
  { children: ReactNode; onBack: () => void },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch(error: Error, info: ErrorInfo) {
    console.error(
      "[Mineblogcraft] Page rendering failed",
      error,
      info.componentStack,
    );
  }
  render() {
    if (!this.state.failed) return this.props.children;
    return (
      <section className="page-recovery" role="alert" aria-label="页面恢复">
        <div>
          <h1>页面暂时无法显示</h1>
          <p>可以重新打开当前页面，或返回首页继续浏览。</p>
          <button autoFocus onClick={() => this.setState({ failed: false })}>
            重新打开页面
          </button>
          <button
            onClick={() => {
              this.setState({ failed: false });
              this.props.onBack();
            }}
          >
            返回首页
          </button>
        </div>
      </section>
    );
  }
}
