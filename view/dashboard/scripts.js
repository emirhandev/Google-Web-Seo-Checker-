document.addEventListener("DOMContentLoaded", function() {

    let point =0;
    fetch('/results/results.json')
        .then(response => response.json())
        .then(data => {
         
            function setStatus(elementId, status) {
                const element = document.getElementById(elementId);
                if (status === "Good") {
                    point++;
                    element.className = 'status good';
                } else if (status === "Neutral") {
                    point = (point+0.5);
                    element.className = 'status neutral';
                } else if (status === "Bad") {
                    element.className = 'status bad';
                }
                element.textContent = status;
            }

          
            // Url 
            document.getElementById('header-url').textContent = data.heading.data.url;


            // Header Check
            setStatus('header-status', data.header.check.status);
            document.getElementById('header-description').textContent = data.header.check.description;
            const headersToCheck = [
                'content-security-policy',
                'strict-transport-security',
                'x-content-type-options',
                'x-frame-options',
                'x-xss-protection',
                'cache-control',
                'expires',
                'etag'
            ];

         
            const missingHeaders = data.header.data.missingHeaders.split(',');

           
            headersToCheck.forEach(header => {
                const statusElement = document.getElementById(header);

                if (missingHeaders.includes(header)) {
                    statusElement.textContent = 'Missing';
                    statusElement.className = 'headerStatus status-missing';
                } else {
                    statusElement.textContent = 'Present';
                    statusElement.className = 'headerStatus status-present';
                    point=point+0.25;
                }
            });


















            // Heading Check
            setStatus('heading-status', data.heading.check.status);
            document.getElementById('h1').textContent =data.heading.data.h1;
            document.getElementById('h2').textContent = data.heading.data.h2;
            document.getElementById('h3').textContent = data.heading.data.h3;
            document.getElementById('h4').textContent = data.heading.data.h4;
            document.getElementById('h5').textContent = data.heading.data.h5;
            document.getElementById('heading-description').textContent = data.heading.check.description;
            const htx = document.getElementById('headingChart').getContext('2d');
            const headingChart = new Chart(htx, {
                type: 'pie',
                data: {
                    labels: ['h1', 'h2', 'h3', 'h4', 'h5'], 
                    datasets: [{
                        label: 'Heading Tag Frequency',
                        data: [data.heading.data.h1,data.heading.data.h2,data.heading.data.h3,data.heading.data.h4,data.heading.data.h5], // Replace with actual data
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return tooltipItem.label + ': ' + tooltipItem.raw;
                                }
                            }
                        },
                        datalabels: {
                            formatter: (value, context) => {
                                if (value === 0) {
                                    return ''; 
                                }
                                let total = context.dataset.data.reduce((a, b) => a + b, 0);
                                let percentage = ((value / total) * 100).toFixed(2) + '%';
                                return percentage;
                            },
                            color: '#fff', 
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels] 
            });
            
           

            // Image Check
            setStatus('image-status', data.image.check.status);
            document.getElementById('image-description').textContent = data.image.check.description;
            document.getElementById('image-number').textContent = data.image.data.totalimages;

            // Meta Check
            document.getElementById('meta-title-length').textContent = data.meta.data.evaluation.titleLength;
            setStatus('meta-title-status', data.meta.check.TitleStatus);
            document.getElementById('meta-title-description').textContent = data.meta.check.TitleDescription;
            setStatus('meta-description-status', data.meta.check.DescriptionStatus);
            document.getElementById('meta-description-description').textContent = data.meta.check.DescriptionDescription;
            document.getElementById('meta-description-length').textContent = data.meta.data.evaluation.descriptionLength;


            // Script Check
            document.getElementById('script-size').textContent = data.script.data.duration;
            setStatus('script-status', data.script.check.status);
            document.getElementById('script-inline').textContent = data.script.data.inlineScriptsCount;
            document.getElementById('script-description').textContent = data.script.check.description;

            // Size Check
            document.getElementById('page-size').textContent = `${data.size.data} Kb`;
            setStatus('size-status', data.size.check.status);
            document.getElementById('size-description').textContent = data.size.check.description;

            // Style Check
            setStatus('style-internal-status', data.style.check.internalStatus);
            document.getElementById('style-internal-description').textContent = data.style.check.internalDescription;
            setStatus('style-external-status', data.style.check.externalStatus);
            document.getElementById('style-external-description').textContent = data.style.check.externalDescription;
            document.getElementById('style-external-address').textContent = data.style.data.externalStyleAdress;

            // Time Check
            document.getElementById('page-load-times').textContent = `${data.time.data} ms`;
            setStatus('load-time-status', data.time.check.status);
            document.getElementById('load-time-description').textContent = data.time.check.description;

            // Text Data
            const sortedWordsText = data.text.data;
            const wordsArray = sortedWordsText.split(',');
            const labels = [];
            const values = [];
            setStatus('text-status', data.text.check.status);
            document.getElementById('text-description').textContent = data.text.check.description;


            for (let i = 0; i < wordsArray.length; i += 2) {
                labels.push(wordsArray[i]);
                values.push(parseInt(wordsArray[i + 1]));
            }

          
            const ctx = document.getElementById('textChart').getContext('2d');
            const textChart = new Chart(ctx, {
                type: 'bar',
                data: {
                    labels: labels,
                    datasets: [{
                        label: 'Text Frequency',
                        data: values,
                        backgroundColor: [
                            'rgba(75, 192, 192, 1)', 
                            'rgba(153, 102, 255, 1)', 
                            'rgba(255, 159, 64, 1)', 
                          
                        ],
                        borderColor: [
                            'rgba(75, 192, 192, 1)', 
                            'rgba(153, 102, 255, 1)', 
                            'rgba(255, 159, 64, 1)', 
                      
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        y: {
                            beginAtZero: true
                        }
                    }
                }
            });



            // Link Check
            setStatus('link-status', data.link.check.status);
            document.getElementById('link-description').textContent = data.link.check.description;
            document.getElementById('internal-link').textContent = data.link.data.internalLinks;
            document.getElementById('external-link').textContent = data.link.data.externalLinks;
            document.getElementById('broken-link').textContent = data.link.data.brokenLinksCount;
            const ltx = document.getElementById('linkChart').getContext('2d');
            const linkChart = new Chart(ltx, {
                type: 'pie',
                data: {
                    labels: ['Internal Links', 'External Links', 'Broken Links'], 
                    datasets: [{
                        label: 'Link Frequency',
                        data: [data.link.data.internalLinks, data.link.data.externalLinks, data.link.data.brokenLinksCount], // Gerekirse verileri değiştirin
                        borderWidth: 1
                    }]
                },
                options: {
                    responsive: true,
                    plugins: {
                        legend: {
                            position: 'top',
                        },
                        tooltip: {
                            callbacks: {
                                label: function(tooltipItem) {
                                    return tooltipItem.label + ': ' + tooltipItem.raw;
                                }
                            }
                        },
                        datalabels: {
                            formatter: (value, context) => {
                                if (value === 0) {
                                    return ''; 
                                }
                                let total = context.dataset.data.reduce((a, b) => a + b, 0);
                                let percentage = ((value / total) * 100).toFixed(2) + '%';
                                return percentage;
                            },
                            color: '#fff', 
                            font: {
                                weight: 'bold'
                            }
                        }
                    }
                },
                plugins: [ChartDataLabels] 
            });


               // Security Check
          
               setStatus('security-status', data.security.check.status);
               document.getElementById('security-description').textContent = data.security.check.description;

        let score = (point/12)*100;


            console.log(score);
            document.getElementById('score').textContent = '%'+score.toFixed(1)

            if (score <50 ) {
                document.getElementById('score').className= "badScore"
               
            } 
            else if (score>=50 && score<70){
                 document.getElementById('score').className= "neutralScore"
            }
            else{
                document.getElementById('score').className= "goodScore"
            }


// Button
document.getElementById("mainPageButton").addEventListener("click", function() {
    window.location.href = '/view/mainPage/mainPage.html';
});
function updateTime() {
    const now = new Date();
    const hours = now.getHours().toString().padStart(2, '0');
    const minutes = now.getMinutes().toString().padStart(2, '0');
    const seconds = now.getSeconds().toString().padStart(2, '0');
    const currentTime = `${hours}:${minutes}:${seconds}`;
    document.getElementById('current-time').textContent = currentTime;
}

// Saati her saniye güncelle
setInterval(updateTime, 1000);

// Sayfa yüklendiğinde saati göster
updateTime();










            

            



        })
        .catch(error => console.error('Error fetching data:', error));
});
