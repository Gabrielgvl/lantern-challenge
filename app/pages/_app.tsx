import {
  AppProps,
  ErrorBoundary,
  ErrorComponent,
  AuthenticationError,
  AuthorizationError,
  ErrorFallbackProps,
  useQueryErrorResetBoundary,
} from "blitz";
import LoginForm from "app/auth/components/LoginForm";
import { StyledEngineProvider } from "@material-ui/core/styles";
import "app/core/styles/index.css";
import muiTheme from "app/core/styles/muiTheme";
import { ThemeProvider } from "@material-ui/core";

export default function App({ Component, pageProps }: AppProps) {
  const getLayout = Component.getLayout || ((page) => page);

  return (
    <ErrorBoundary
      FallbackComponent={RootErrorFallback}
      onReset={useQueryErrorResetBoundary().reset}
    >
      <ThemeProvider theme={muiTheme}>
        <StyledEngineProvider injectFirst />
        {getLayout(<Component {...pageProps} />)}
      </ThemeProvider>
    </ErrorBoundary>
  );
}

function RootErrorFallback({ error, resetErrorBoundary }: ErrorFallbackProps) {
  if (error instanceof AuthenticationError) {
    return <LoginForm onSuccess={resetErrorBoundary} />;
  } else if (error instanceof AuthorizationError) {
    return (
      <ErrorComponent
        statusCode={error.statusCode}
        title="Sorry, you are not authorized to access this"
      />
    );
  } else {
    return (
      <ErrorComponent statusCode={error.statusCode || 400} title={error.message || error.name} />
    );
  }
}
