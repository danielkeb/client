import AuthChecker from "./AuthChecker";
import LandingPage from "./LandingPage";

export default function Home() {
  return (
    <AuthChecker>
      <LandingPage />
    </AuthChecker>
  );
}
