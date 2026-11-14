"""Build the optional PS4 PKG reader; requires git and the .NET 8 SDK.

No Sony utilities or theme assets are downloaded. The MIT-licensed reader is
pinned to a reviewed revision. Output is a local optional dependency.
"""
import pathlib
import shutil
import subprocess
import tempfile

REVISION = "3de6da849b64a8ad0d5ba00dd4e8919934b868b0"
ROOT = pathlib.Path(__file__).resolve().parents[1]


def main():
    if not shutil.which("git") or not shutil.which("dotnet"):
        raise SystemExit("Install git and the .NET 8 SDK, then run this script again")
    output = ROOT / "tools" / "ps4-pkg-helper"
    with tempfile.TemporaryDirectory(prefix="dht-pkg-build-") as temporary:
        source = pathlib.Path(temporary)
        def run(*args):
            subprocess.run(args, cwd=source, check=True)
        run("git", "init", "--quiet")
        run("git", "remote", "add", "origin", "https://github.com/pearlxcore/OrbisPkgTool.git")
        run("git", "fetch", "--depth", "1", "origin", REVISION)
        run("git", "checkout", "--detach", "FETCH_HEAD")
        project = source / "OrbisPkgTool" / "OrbisPkgTool.csproj"
        project.write_text(project.read_text(encoding="utf-8").replace("net10.0-windows", "net8.0"), encoding="utf-8")
        run("dotnet", "publish", str(project), "-c", "Release", "-o", str(output), "--nologo", "-v", "quiet")
        shutil.copyfile(source / "LICENSE", output / "OrbisPkgTool-LICENSE.txt")
        (output / "SOURCE.txt").write_text("https://github.com/pearlxcore/OrbisPkgTool\n" + REVISION + "\nTarget framework changed to net8.0.\n", encoding="utf-8")
    print("PS4 PKG helper installed:", output)


if __name__ == "__main__":
    main()
