resolve_symlink () {
    t="$(ls -dl "$1")"
    echo "${t#*"$t"-> }"
}
