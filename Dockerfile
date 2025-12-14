FROM php:8.1-apache
RUN sed -ri "s/Listen 80/Listen 8080/" /etc/apache2/ports.conf /etc/apache2/sites-available/*.conf
WORKDIR /var/www/html
COPY . /var/www/html/
RUN chown -R www-data:www-data /var/www/html/uploads /var/www/html/data || true
EXPOSE 8080
CMD ["apache2-foreground"]
