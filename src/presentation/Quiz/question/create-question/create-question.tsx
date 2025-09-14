import { useForm, useFieldArray } from 'react-hook-form';
import { useCreateQuestion } from '../../../../hooks';
import { Quiz } from '../../../../types';
import { DialogContainer, showToast, Button, Typography } from '../../../../components';
import { BsPlusCircle } from 'react-icons/bs';
import { QuestionItem } from './question-item';

type FormValues = {
  questions: Omit<Quiz.Question, 'id' | 'quizId'>[];
};

type MultiQuestionDialogProps = {
  open: boolean;
  onClose: () => void;
  quizId: number;
};

export function MultiQuestionDialog({ open, onClose, quizId }: MultiQuestionDialogProps) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors },
    trigger,
  } = useForm<FormValues>({
    mode: 'onChange',
    reValidateMode: 'onChange',
    defaultValues: {
      questions: [
        {
          type: 'short',
          prompt: '',
          correctAnswer: '',
          options: [],
          position: 0,
        },
      ],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control,
    name: 'questions',
  });

  const { handleCreateQuestion, isLoading } = useCreateQuestion({
    quizId,
    onSuccess: () => {
      reset();
      showToast.success('Questions created successfully!');
      onClose();
    },
    onError: () => {
      showToast.error('Questions creation failed.');
    },
  });

  const onSubmit = (data: FormValues) => {
    data.questions.forEach((q) => {
      const payload: Omit<Quiz.Question, 'id' | 'quizId'> = {
        type: q.type,
        prompt: q.prompt,
        position: q.position,
        correctAnswer: q.correctAnswer ?? '',
        ...(q.type === 'mcq' ? { options: q.options } : {}),
      };

      handleCreateQuestion(payload);
    });
  };

  const handleClose = () => {
    reset();
    onClose();
  };

  return (
    <DialogContainer
      open={open}
      onClose={handleClose}
      title='Add Questions'
      footer={
        <div className='flex justify-end gap-2'>
          <Button
            variant='secondary'
            onClick={handleClose}
          >
            <Typography variant='small'>Cancel</Typography>
          </Button>
          <Button
            variant='outline'
            disabled={isLoading}
            onClick={handleSubmit(onSubmit)}
          >
            <Typography variant='small'>{isLoading ? 'Creating...' : 'Add Question'}</Typography>
          </Button>
        </div>
      }
    >
      <form className='flex flex-col gap-6'>
        {fields.map((field, index) => (
          <QuestionItem
            setValue={setValue}
            key={field.id}
            field={field}
            index={index}
            control={control}
            register={register}
            errors={errors}
            remove={remove}
            fieldsLength={fields.length}
          />
        ))}
        <div className='flex justify-end'>
          <Button
            variant='outline'
            icon={<BsPlusCircle />}
            size='lg'
            onClick={async () => {
              const isValid = await trigger('questions'); // validates all questions
              if (!isValid) return;
              append({
                type: 'short',
                prompt: '',
                options: [],
                correctAnswer: '',
                position: 0,
              });
            }}
            className='self-start'
          >
            <Typography variant='caption'>Add Another Question</Typography>
          </Button>
        </div>
      </form>
    </DialogContainer>
  );
}
