// Turns a breed name into a URL-friendly slug, e.g. "Afghan Hound" -> "afghan-hound".
// Shared here (rather than duplicated in DogCard and Home) so every link we
// build uses the exact same rule and never drifts out of sync.
export function slugify(name) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-") // any run of non-alphanumeric chars becomes one dash
    .replace(/(^-|-$)/g, ""); // trim leading/trailing dashes
}
