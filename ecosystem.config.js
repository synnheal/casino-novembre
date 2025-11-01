module.exports = {
  apps: [
    // Backend désactivé - Le jeu Crash fonctionne maintenant en local
    // Plus besoin de serveur Socket.io séparé
    {
      name: 'frontend',
      script: 'node_modules/.bin/next',
      args: 'start -p 8006 -H 0.0.0.0',
      instances: 1,
      autorestart: true,
      watch: false,
      env: {
        NODE_ENV: 'production',
        PORT: 8006
      }
    }
  ]
};