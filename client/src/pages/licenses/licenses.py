import json
import os
import re
import subprocess


def format_copyright(copyright: str):
    # Format (c) to unicode copyright
    copyright = copyright.replace("(c)", "\u00A9").replace("(C)", "\u00A9")
    copyright = copyright.replace(".", "")

    # Truncate after "All rights reserved". Lowercase to handle weird case
    substring = "all rights reserved"
    if copyright.lower().count(substring) > 0:
        copyright = copyright[: copyright.lower().index(substring) + len(substring)]

    # Remove site links
    copyright = " ".join([t for t in copyright.split() if not t.startswith("http")])

    # Replace bracket errors with brackets, then remove all text withing brackets
    copyright = copyright.replace("&lt;", "<").replace("&gt;", ">")
    copyright = re.sub(r"\([^()]*\)", "", copyright)
    copyright = re.sub(r"\<[^<>]*\>", "", copyright)
    copyright = re.sub(r"\[[^\[\]]*\]", "", copyright)

    return copyright


# Enables program to work from root sr-velocity folder
cwd = os.getcwd()
if not cwd.endswith("client") and not cwd.endswith("client/"):
    os.chdir("client")

# Runs license-checker to update package info
subprocess.run(
    [
        "npx",
        "license-checker",
        "--json",
        "--out",
        "src/pages/licenses/licenses.json",
        "--customPath",
        "src/pages/licenses/licenses_format.json",
    ]
)

with open("src/pages/licenses/licenses.json") as f:
    package_dict: dict[str, dict[str, str]] = json.load(f)

for package in package_dict.items():
    # Add package name into dict, removing subpackage info
    # Format to remove @ and make titlecase
    name = package[0].split("/")[0].removeprefix("@").title()
    # Remove package version after package name
    if name.count("@") > 0:
        name = name[: name.index("@")]
    package[1]["name"] = name

# Make a list of packages instead of a dict
dirty_packages: list[dict[str, str]] = [package[1] for package in package_dict.items()]

packages = []
seen_repos = set()
seen_names = set()
for package in dirty_packages:
    repo = package.get("repository")
    name = package["name"]

    # Skip packages with no repository or with invalid URL
    if repo is None or repo.startswith("git:"):
        continue

    # Format repo URL
    repo = repo.removeprefix("git+")
    if repo.count("/") > 4:
        repo = repo.split("/")
        repo = "/".join(repo[1:4])
        repo = repo.removeprefix("/")
        repo = "https://" + repo
    package["repository"] = repo  # Update repo URL in dict

    package["copyright"] = format_copyright(package["copyright"])

    # Set copyright to publisher if copyright wasn't available
    if package["copyright"] == "" and package.get("publisher") is not None:
        package["copyright"] = "Copyright \u00A9 " + package["publisher"]

    # Remove unnecessary keys from package dict
    if package.get("publisher") is not None:
        del package["publisher"]
    if package.get("email") is not None:
        del package["email"]
    if package.get("path") is not None:
        del package["path"]
    if package.get("licenseFile") is not None:
        del package["licenseFile"]
    if package.get("licenseText") is not None:
        del package["licenseText"]

    # Add only non-duplicate packages
    if repo not in seen_repos and name not in seen_names:
        packages.append(package)
        seen_repos.add(repo)
        seen_names.add(name)

with open("src/pages/licenses/licenses.json", "w") as f:
    f.write(json.dumps(packages, indent=2))
