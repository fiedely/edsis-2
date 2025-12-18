{ pkgs, ... }: {
  channel = "stable-24.05"; 
  packages = [
    pkgs.nodejs_22
    pkgs.python312
    pkgs.python312Packages.pip
    pkgs.firebase-tools
  ];
  idx = {
    extensions = [
      "esbenp.prettier-vscode"
      "bradlc.vscode-tailwindcss"
      "ms-python.python"
    ];
    previews = {
      enable = true;
      previews = {
        web = {
          command = ["npm" "run" "dev" "--prefix" "frontend" "--" "--port" "$PORT" "--host" "0.0.0.0"];
          manager = "web";
        };
      };
    };
  };
}