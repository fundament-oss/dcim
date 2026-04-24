{{/*
Selector labels for a component.
Usage: include "dcim.selectorLabels" (dict "root" $ "name" "dcim-api")
*/}}
{{- define "dcim.selectorLabels" -}}
app.kubernetes.io/name: {{ .name }}
app.kubernetes.io/instance: {{ .root.Release.Name }}-{{ .name }}
{{- end }}

{{/*
Common labels applied to all resources.
Usage: include "dcim.labels" (dict "root" $ "name" "dcim-api" "component" "backend")
*/}}
{{- define "dcim.labels" -}}
{{ include "dcim.selectorLabels" . }}
app.kubernetes.io/part-of: dcim
app.kubernetes.io/component: {{ .component }}
app.kubernetes.io/managed-by: {{ .root.Release.Service }}
helm.sh/chart: {{ .root.Chart.Name }}-{{ .root.Chart.Version | replace "+" "_" }}
{{- end }}

{{/*
Database name
*/}}
{{- define "dcim.db.name" -}}
db
{{- end }}

{{/*
Database host (CNPG read-write service)
*/}}
{{- define "dcim.db.host" -}}
{{ include "dcim.db.name" . }}-rw
{{- end }}

{{/*
Database superuser secret name
*/}}
{{- define "dcim.db.superuserSecretName" -}}
{{ include "dcim.db.name" . }}-superuser
{{- end }}

{{/*
Subdomain infix for ingress hostnames (e.g., "pr123." for PR environments)
*/}}
{{- define "dcim.ingress.infix" -}}
{{ $.Values.ingress.subdomainInfix | default "" }}
{{- end }}
