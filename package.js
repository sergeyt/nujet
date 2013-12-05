Package.describe({
  summary: "NuGet client"
});

Package.on_use(function(api, where) {
  api.use('http', ['server']);
  api.use('jquery', ['client']);

  api.add_files('index.js', ['server', 'client']);
});
