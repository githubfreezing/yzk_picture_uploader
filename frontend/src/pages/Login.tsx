export default function CenteredComponent() {
  return (
    <div className="bg-gray-100 p-4 min-h-screen">
      <div className="bg-white p-8 shadow-lg rounded-2xl">
        <h1 className="text-2xl font-bold text-left">中央揃えのReactサンプル</h1>
        <p className="mt-4 text-left text-gray-600">
          これはTailwind CSSを利用して画面の中央に揃えたReactコンポーネントのサンプルです。
        </p>
      </div>
    </div>
  );
}