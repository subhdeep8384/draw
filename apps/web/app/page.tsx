import NavBar from "@/components/navbar";

export default function Home() {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <NavBar />
      <LandingPage />
    </div>
  );
}

function LandingPage() {
  return (<>hello</>)
}
