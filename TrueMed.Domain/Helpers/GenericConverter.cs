using System;

public class GenericConverter
{
    public static TTarget Convert<TSource, TTarget>(TSource source)
    {
        if (source == null)
        {
            return default;
        }

        Type targetType = typeof(TTarget);
        Type sourceType = typeof(TSource);

        if (targetType.IsAssignableFrom(sourceType))
        {
            return (TTarget)(object)source;
        }

        throw new InvalidCastException($"Cannot convert from {sourceType} to {targetType}.");
    }
}