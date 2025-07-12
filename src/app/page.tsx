import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-orange-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-screen py-12">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              <span className="text-rose-600">Wedding</span> Planner
            </h1>
            <p className="text-xl sm:text-2xl text-gray-600 mb-8 max-w-3xl">
              Organisez votre mariage de rêve avec nos outils dédiés aux traditions 
              <span className="font-semibold text-rose-600"> marocaines</span>,
              <span className="font-semibold text-green-600"> tunisiennes</span> et
              <span className="font-semibold text-blue-600"> algériennes</span>
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center">
              <Link 
                href="/auth/signup"
                className="bg-rose-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-rose-700 transition-colors"
              >
                Créer un compte
              </Link>
              <Link 
                href="/auth/signin"
                className="bg-white text-rose-600 px-8 py-3 rounded-lg font-semibold border-2 border-rose-600 hover:bg-rose-50 transition-colors"
              >
                Se connecter
              </Link>
            </div>
          </div>
          
          <div className="mt-20 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">👰</div>
              <h3 className="text-xl font-semibold mb-2">Profil personnalisé</h3>
              <p className="text-gray-600">
                Créez votre profil avec vos traditions culturelles et organisez chaque étape de votre mariage
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">📅</div>
              <h3 className="text-xl font-semibold mb-2">Planning complet</h3>
              <p className="text-gray-600">
                Gérez fiançailles, khotba, henné, EVJF, cérémonies et réception avec un calendrier intégré
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Budget maîtrisé</h3>
              <p className="text-gray-600">
                Suivez vos dépenses par poste et restez dans votre budget avec nos outils de gestion
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="text-xl font-semibold mb-2">Checklist culturelle</h3>
              <p className="text-gray-600">
                Listes personnalisées selon vos traditions pour ne rien oublier de votre préparation
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">🎨</div>
              <h3 className="text-xl font-semibold mb-2">Trousseau & traditions</h3>
              <p className="text-gray-600">
                Organisez votre trousseau et découvrez les rituels spécifiques à votre culture
              </p>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <div className="text-3xl mb-4">👥</div>
              <h3 className="text-xl font-semibold mb-2">Collaboration</h3>
              <p className="text-gray-600">
                Travaillez avec votre wedding planner et impliquez votre famille dans l'organisation
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
