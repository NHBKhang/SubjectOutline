from core.models import User, Faculty, Major, Course, LearningOutcome, Evaluation, SubjectOutline
from django import forms
from django.forms import ValidationError
from ckeditor_uploader.widgets import CKEditorUploadingWidget


class DescriptionBaseForm(forms.ModelForm):
    description = forms.CharField(widget=CKEditorUploadingWidget)


class FacultyForm(DescriptionBaseForm):
    class Meta:
        model = Faculty
        fields = '__all__'


class MajorForm(DescriptionBaseForm):
    class Meta:
        model = Major
        fields = '__all__'


class CourseForm(forms.ModelForm):
    class Meta:
        model = Course
        fields = '__all__'


class UserForm(forms.ModelForm):
    class Meta:
        model = User
        fields = '__all__'


class LearningOutcomeForm(forms.ModelForm):
    class Meta:
        model = LearningOutcome
        fields = '__all__'


class EvaluationForm(forms.ModelForm):
    class Meta:
        model = Evaluation
        fields = '__all__'

    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        try:
            if self.instance and self.instance.outline:
                self.fields['learning_outcomes'].queryset = LearningOutcome.objects.filter(objective__outline=
                                                                                           self.instance.outline)
        except Exception:
            self.fields['learning_outcomes'].queryset = LearningOutcome.objects.none()


class SubjectOutlineForm(forms.ModelForm):
    class Meta:
        model = SubjectOutline
        exclude = '__all__'

    def clean(self):
        cleaned_data = super().clean()

        years = cleaned_data.get('years', None)
        if years.count() > 2:
            raise ValidationError('A subject outline can only be used for less than 2 school years.')

        return self.cleaned_data
