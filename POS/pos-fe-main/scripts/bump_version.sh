#!/bin/bash
set +x
set -o pipefail

usage() {
    echo """
        This script is used to bump version of microservices
        How to run: ./bump_version.sh --changelog <absolute-path-to-CHANGELOG.md-file> --version <current-version>
        Example: ./bump_version.sh --changelog /home/user/workspace/repo/CHANGELOG.md --version 1.0.0
        Options:
            --help|-h               Show options of script
            --changelog|-c          Absolute path of CHANGELOG.md file
            --version|-v            Current version
    """
    exit 0
}

# $1 is log level
# $2 is message
log() {
    echo "$1: $2"
}

# $1 is absolute path of CHANGELOG.md file
# Get action to bump version. The action in list:
# - Added -> Bump major version
# - Changed -> Bump minor version
# - Fixed -> Bump patch version
_get_bump_action() {
    local _action=$(cat $1| grep -Po "^##\s(Added|Changed|Fixed)$" | head -n 1 | sed 's/## //g')
    echo ${_action}
}

# $1 is absolute path of CHANGELOG.md file
# $2 is current version
# Bumping current version depends on bump actions
_bump_version() {
    local _current_version="$2"
    local _major_version=$(echo ${_current_version} | awk -F. '{print $1}')
    local _minor_version=$(echo ${_current_version} | awk -F. '{print $2}')
    local _patch_version=$(echo ${_current_version} | awk -F. '{print $3}')
    local _action=$(_get_bump_action $1)
    local _version=

    log INFO "Bump action is ${_action}"

    case "${_action}" in
        Fixed)
            _version="${_major_version}.${_minor_version}.$((${_patch_version} + 1))"
            ;;
        Added)
            _version="$((${_major_version} + 1)).0.0"
            ;;
        Changed)
            _version="${_major_version}.$((${_minor_version} + 1)).0"
            ;;
        *)
            log ERROR "Cannot get bump action. Current action is ${_action}"\
            exit 1
            ;;
    esac
    log INFO "Version after bumping is ${_version}"
    echo ${_version}
}

# $1 is absolute path of CHANGELOG.md file
# $2 is current version
main() {
    _bump_version $1 $2
}

CURRENT_VERSION=
CHANGELOG_PATH=

options=$(getopt -l "help,changelog:,version:" -o "hc:v:" -- "$@")
eval set -- "${options}"
while true; do
    case "$1" in
        --help|-h)
            usage
            ;;
        --changelog|-c)
            shift
            CHANGELOG_PATH="$1"
            ;;
        --version|-v)
            shift
            CURRENT_VERSION="$1"
            ;;
        --)
            shift
            break;;
        *)
            usage
    esac
    shift
done

if [[ -f ${CHANGELOG_PATH} ]]; then
    log INFO "CHANGELOG.md path is ${CHANGELOG_PATH}"
else
    log ERROR "${CHANGELOG_PATH} is not existed"
    exit 1
fi
if [[ "${CURRENT_VERSION}" =~ ^[0-9]+.[0-9]+.[0-9]+$ ]]; then
    log INFO "Current version is ${CURRENT_VERSION}"
else
    log ERROR "Current version is wrong format"
    exit 1
fi

main ${CHANGELOG_PATH} ${CURRENT_VERSION}